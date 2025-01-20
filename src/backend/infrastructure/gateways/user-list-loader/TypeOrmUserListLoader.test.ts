import { Repository } from "typeorm";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { RoleModel } from "../../../../../database/models/RoleModel";
import { UserListEtablissementModel } from "../../../../../database/models/UserListEtablissementModel";
import { UserListModel } from "../../../../../database/models/UserListModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { clearAllTables, getOrm } from "../../../testHelper";
import { TypeOrmUserListLoader } from "./TypeOrmUserListLoader";

describe("La recherche de liste", () => {
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
        await createUser("otherUserEmail", otherUserUuid);
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

    async function addEtablishmentToList(listId: number, finess: string) {
        const listEtablishment = new UserListEtablissementModel();
        listEtablishment.listId = listId;
        listEtablishment.finessNumber = finess;

        await userListEtablissementRepository.save(listEtablishment);
    }

    it("crée une liste", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "List";

        // WHEN
        await userListLoader.create(userUuid, listName);

        // THEN
        const results = await userListRepository.find();
        expect(results).toHaveLength(1);
        expect(results[0].nom).toBe(listName);
    });

    it("ne récupére que les listes de l’utilisateur", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "listName";
        const otherUserListName = "OtherListName";

        await createList(listName, userUuid);
        await createList(otherUserListName, otherUserUuid);

        // WHEN
        const results = await userListLoader.getAll(userUuid);

        // THEN
        expect(results).toHaveLength(1);
        expect(results[0].nom).toBe(listName);
    });

    it("récupère la liste par son id", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "listName";
        const otherListName = "OtherListName";

        const list = await createList(listName, userUuid);
        await createList(otherListName, userUuid);

        // WHEN
        const result = await userListLoader.getById(userUuid, list.id);

        // THEN
        expect(result).not.toBeNull();
        expect(result?.nom).toBe(listName);
    });

    it("ne récupère pas la liste d’un autre user par son id", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "listName";
        const otherListName = "OtherListName";

        const list = await createList(listName, userUuid);
        await createList(otherListName, userUuid);

        // WHEN
        const result = await userListLoader.getById(otherUserUuid, list.id);

        // THEN
        expect(result).toBeNull();
    });

    it("récupére les etablissements dans la liste", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "listName";
        const finess = "finess";

        const list = await createList(listName, userUuid);
        await addEtablishmentToList(list.id, finess);

        // WHEN
        const result = await userListLoader.getById(userUuid, list.id);

        // THEN
        expect(result).not.toBeNull();
        expect(result?.nom).toBe(listName);
        expect(result?.userListEtablissements).toHaveLength(1);
        expect(result?.userListEtablissements[0].finessNumber).toBe(finess);
    });

    it("récupére le nom et l’id de toutes les listes d’un utilisateur", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "listName";
        const otherListName = "OtherListName";
        const otherUserListName = "OtherUserListName";

        const list = await createList(listName, userUuid);
        const otherList = await createList(otherListName, userUuid);
        await createList(otherUserListName, otherUserUuid);

        // WHEN
        const result = await userListLoader.getAllIdAndName(userUuid);

        // THEN
        expect(result).toHaveLength(2);
        const listNames = result.map((list) => list.nom);
        expect(listNames).toEqual(expect.arrayContaining([listName, otherListName]));
        const listIds = result.map((list) => list.id);
        expect(listIds).toEqual(expect.arrayContaining([list.id, otherList.id]));
    });

    it("modifie le nom d’une liste", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "listName";
        const newListName = "NewListName";

        const list = await createList(listName, userUuid);

        // WHEN
        await userListLoader.updateName(userUuid, list.id, newListName);

        // THEN
        const dbList = await userListRepository.findOneByOrFail({ id: list.id });
        expect(dbList).not.toBeNull();
        expect(dbList.nom).toEqual(newListName);
    });

    it("ne modifie le nom d’une liste d’un autre user", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "listName";
        const newListName = "NewListName";

        const list = await createList(listName, userUuid);

        // WHEN
        await userListLoader.updateName(otherUserUuid, list.id, newListName);

        // THEN
        const dbList = await userListRepository.findOneByOrFail({ id: list.id });
        expect(dbList).not.toBeNull();
        expect(dbList.nom).toEqual(listName);
    });

    it("supprime une liste", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "listName";

        const list = await createList(listName, userUuid);

        // WHEN
        await userListLoader.delete(userUuid, list.id);

        // THEN
        const dbList = await userListRepository.findOneBy({ id: list.id });
        expect(dbList).toBeNull();
        const lists = await userListRepository.find();
        expect(lists).toHaveLength(0);
    });

    
    it("ne supprime pas la liste d’un autre user", async () => {
        // GIVEN
        const userListLoader = new TypeOrmUserListLoader(orm);

        const listName = "listName";

        const list = await createList(listName, userUuid);

        // WHEN
        await userListLoader.delete(otherUserUuid, list.id);

        // THEN
        const dbList = await userListRepository.findOneBy({ id: list.id });
        expect(dbList).not.toBeNull();
        const lists = await userListRepository.find();
        expect(lists).toHaveLength(1);
    });
});