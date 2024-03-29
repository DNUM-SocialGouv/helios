import { screen } from "@testing-library/react";

import { renderFakeComponent } from "../../../../../test-helpers/testHelper";
import TheadTable from "./TheadTable";

jest.mock("next/router", () => require("next-router-mock"));

describe("En-tête du tableau", () => {
  it("affiche le 'Date de création' dans le th tableau", () => {
    renderFakeComponent(
      <table>
        <TheadTable
          paginationData={{
            institutionId: 0,
            institutions: [],
            keyWord: "",
            key: "",
            page: 1,
            profileId: "",
            profiles: [],
            roleId: 0,
            etatId: "",
            roles: [],
            itemsPerPage: 10,
            lastPage: 2,
            orderBy: "nom",
            sortDir: "DESC",
            total: 20,
            setKey: () => function () {},
            setInstitutionId: () => function () {},
            setLastPage: () => function () {},
            setPage: () => function () {},
            setProfileId: () => function () {},
            setRoleId: () => function () {},
            setUserData: () => function () {},
            setItemsPerPage: () => function () {},
            setEtatId: () => function () {},
            getUsersAndRefresh: () => function () {},
            setOrderBy: () => function () {},
            setSortDir: () => function () {},
            setTotal: () => function () {},
          }}
        />
      </table>
    );

    // THEN
    const dateDeCreationHeader = screen.getByRole("columnheader", { name: /Date de création/i });
    expect(dateDeCreationHeader).toBeInTheDocument();
  });
});
