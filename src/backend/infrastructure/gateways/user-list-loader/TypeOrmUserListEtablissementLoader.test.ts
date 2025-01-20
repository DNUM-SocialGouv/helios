import { Repository } from "typeorm";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { RoleModel } from "../../../../../database/models/RoleModel";
import { UserListEtablissementModel } from "../../../../../database/models/UserListEtablissementModel";
import { UserListModel } from "../../../../../database/models/UserListModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { clearAllTables, getOrm } from "../../../testHelper";
import { TypeOrmUserListEtablissementLoader } from "./TypeOrmUserListEtablissementLoader";

describe("La recherche des etablissements dans une liste", () => {
    const orm = getOrm();
    const userUuid = "d4d1c0b2-592b-406d-ac72-f27a5300345a";
    const otherUserUuid = "e406415d-1c52-4a4f-b574-abfda22ff0b2";

    let institutionRepository: Repository<InstitutionModel>;
    let roleRepository: Repository<RoleModel>;
    let utilisateurRepository: Repository<UtilisateurModel>;
    let userListEtablissementRepository: Repository<UserListEtablissementModel>;
    let userListRepository: Repository<UserListModel>;

    let institutionId: number;
    let roleId: number;
    let listId: number;

    beforeAll(async () => {
        institutionRepository = (await orm).getRepository(InstitutionModel);
        roleRepository = (await orm).getRepository(RoleModel);
        utilisateurRepository = (await orm).getRepository(UtilisateurModel);
        userListEtablissementRepository = (await orm).getRepository(UserListEtablissementModel);
        userListRepository = (await orm).getRepository(UserListModel);
    });

    beforeEach(async () => {
        await clearAllTables(await orm);

        await createInstitution();
        await createRole();
        await createUser("userEmail", userUuid);
        const list = await createList("listName", userUuid);
        listId = list.id;
    });

    afterAll(async () => {
        await (await orm).destroy();
    });

    async function createInstitution() {
        const institution = new InstitutionModel();
        institution.code = "code";
        institution.codeGeo = "geo";
        institution.libelle = "Institution";

        const dbInstitution = await institutionRepository.save(institution);
        institutionId = dbInstitution.id;

    }

    async function createRole() {
        const role = new RoleModel();
        role.code = "code";
        role.libelle = "Role";
        role.ordre = 0;

        const dbRole = await roleRepository.save(role);
        roleId = dbRole.id;
    }

    async function createUser(email: string, uuid: string) {
        const account = new UtilisateurModel;
        account.nom = "name";
        account.prenom = "firstName";
        account.email = email;
        account.institutionId = institutionId;
        account.roleId = roleId + "";
        account.code = uuid;

        await utilisateurRepository.save(account);
    };

    async function createList(name: string, userUuid: string): Promise<UserListModel> {
        const list = new UserListModel();
        list.nom = name;
        list.userId = userUuid;
        list.isFavoris = false;

        return await userListRepository.save(list);
    }

    it("ajoute un etablissement à une liste", async () => {
        // GIVEN
        const userListEtablissementLoader = new TypeOrmUserListEtablissementLoader(orm);

        const finess = "finess";
        const typeEtablissement = "type";

        // WHEN
        await userListEtablissementLoader.create(userUuid, listId, finess, typeEtablissement);

        // THEN
        const list = await userListRepository.findOneByOrFail({ id: listId });
        expect(list).not.toBeNull();
        expect(list?.userListEtablissements).toHaveLength(1);
        expect(list?.userListEtablissements[0].finessNumber).toEqual(finess);
        expect(list?.userListEtablissements[0].typeEtablissement).toEqual(typeEtablissement);
    });

    it("n’ajoute pas un etablissement à une liste d’un autre utilisateur", async () => {
        // GIVEN
        const userListEtablissementLoader = new TypeOrmUserListEtablissementLoader(orm);

        const finess = "finess";
        const typeEtablissement = "type";

        // WHEN
        await userListEtablissementLoader.create(otherUserUuid, listId, finess, typeEtablissement);

        // THEN
        const list = await userListRepository.findOneByOrFail({ id: listId });
        expect(list).not.toBeNull();
        expect(list?.userListEtablissements).toHaveLength(0);
    });

    it("supprime un etablissement d’une liste", async () => {
        // GIVEN
        const userListEtablissementLoader = new TypeOrmUserListEtablissementLoader(orm);

        const finess = "finess";

        const userListEtablissement = new UserListEtablissementModel();
        userListEtablissement.listId = listId;
        userListEtablissement.finessNumber = finess;
        userListEtablissement.typeEtablissement = "type";
        
        await userListEtablissementRepository.save(userListEtablissement);
        let list = await userListRepository.findOneByOrFail({ id: listId });
        expect(list).not.toBeNull();
        expect(list?.userListEtablissements).toHaveLength(1);

        // WHEN
        await userListEtablissementLoader.delete(userUuid, listId, finess);

        // THEN
        list = await userListRepository.findOneByOrFail({ id: listId });
        expect(list).not.toBeNull();
        expect(list?.userListEtablissements).toHaveLength(0);
    });

    it("ne supprime un etablissement de la liste d’un autre utilisateur", async () => {
        // GIVEN
        const userListEtablissementLoader = new TypeOrmUserListEtablissementLoader(orm);

        const finess = "finess";

        const userListEtablissement = new UserListEtablissementModel();
        userListEtablissement.listId = listId;
        userListEtablissement.finessNumber = finess;
        userListEtablissement.typeEtablissement = "type";
        
        await userListEtablissementRepository.save(userListEtablissement);
        let list = await userListRepository.findOneByOrFail({ id: listId });
        expect(list).not.toBeNull();
        expect(list?.userListEtablissements).toHaveLength(1);

        // WHEN
        await userListEtablissementLoader.delete(otherUserUuid, listId, finess);

        // THEN
        list = await userListRepository.findOneByOrFail({ id: listId });
        expect(list).not.toBeNull();
        expect(list?.userListEtablissements).toHaveLength(1);
    });

});