import { DataSource } from "typeorm";

import { RechercheModel } from "../../../../../database/models/RechercheModel";
import { UserListEtablissementModel } from "../../../../../database/models/UserListEtablissementModel";
import { UserListModel } from "../../../../../database/models/UserListModel";
import { UserListEtablissementLoader } from "../../../métier/gateways/UserListEtablissementLoader";

export class TypeOrmUserListEtablissementLoader implements UserListEtablissementLoader {
    constructor(private readonly orm: Promise<DataSource>) { }
    async getByListIdOrderedAndPaginated(idUser: string, listId: number, order: string, orderBy: string, page: number, limit: number): Promise<RechercheModel[]> {
        const orderString = order === "ASC" ? "ASC" : "DESC";
        const orderByString = (orderBy === "dateCreation" ? "userListEtab." : "recherche.") + orderBy; 

        return await (await this.orm).createQueryBuilder()
        .select("recherche.numero_finess", "numéroFiness")
        .addSelect("recherche.raison_sociale_courte", "raisonSocialeCourte")
        .addSelect("recherche.type", "type")
        .addSelect("recherche.commune", "commune")
        .addSelect("recherche.departement", "département")
        .addSelect(
            `CASE 
              WHEN recherche.type != 'Entité juridique' THEN CONCAT('EJ', ' - ', recherche.rattachement, ' - ', entite_juridique.raison_sociale_courte)
              ELSE 
              CONCAT(
                'Sanitaire (', 
                COUNT(CASE WHEN etablissement_territorial.domaine = 'Sanitaire' THEN etablissement_territorial.numero_finess_entite_juridique END),
                '), SMS (',
                COUNT(CASE WHEN etablissement_territorial.domaine = 'Médico-social' THEN etablissement_territorial.numero_finess_entite_juridique END), ')'
              )
            END`,
            "rattachement"
        )
        .from(UserListEtablissementModel, "userListEtab")
        .leftJoin("recherche", "recherche", "userListEtab.numero_finess = recherche.numero_finess")
        .leftJoin("user_list", "userList", "userListEtab.list_id = userList.id")
        .leftJoin("entite_juridique", "entite_juridique", "recherche.rattachement = entite_juridique.numero_finess_entite_juridique")
        .leftJoin("etablissement_territorial", "etablissement_territorial", "etablissement_territorial.numero_finess_entite_juridique = recherche.numero_finess")
        .where("userList.id = :listId", { listId })
        .andWhere("userList.ut_id = :idUser", { idUser })
        .addGroupBy("recherche.numero_finess")
        .addGroupBy("recherche.raison_sociale_courte")
        .addGroupBy("recherche.type")
        .addGroupBy("recherche.commune")
        .addGroupBy("recherche.departement")
        .addGroupBy("recherche.rattachement")
        .addGroupBy("entite_juridique.raison_sociale_courte")
        .addGroupBy("userListEtab.date_creation")
        .addOrderBy(orderByString, orderString)
        .limit(limit)
        .offset((page - 1) * limit)
        .getRawMany<RechercheModel>();
    }

    async create(userId: string, listId: number, finessNumber: string, typeEtablissement: string): Promise<void> {
        const userListEtablissementModel = new UserListEtablissementModel();
        userListEtablissementModel.listId = listId;
        userListEtablissementModel.finessNumber = finessNumber;
        userListEtablissementModel.typeEtablissement = typeEtablissement;

        const countList = await (await this.orm).getRepository(UserListModel).countBy({ id: listId, userId: userId });

        if (countList !== 0) {
            await (await this.orm).getRepository(UserListEtablissementModel).save(userListEtablissementModel);
        }
    }

    async delete(userId: string, listId: number, finess: string): Promise<void> {
        const countList = await (await this.orm).getRepository(UserListModel).countBy({ id: listId, userId: userId });

        if (countList !== 0) {
            await (await this.orm).getRepository(UserListEtablissementModel).delete({ listId: listId, finessNumber: finess });
        }
    }
}