import { screen } from "@testing-library/react";

import TheadTable from "./TheadTable";
import { renderFakeComponent } from "../../../../../test-helpers/testHelper";

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
            setKey: () => new Promise(function () { }),
            setInstitutionId: () => new Promise(function () { }),
            setLastPage: () => function () { },
            setPage: () => new Promise(function () { }),
            setProfileId: () => new Promise(function () { }),
            setRoleId: () => new Promise(function () { }),
            setUserData: () => function () { },
            setItemsPerPage: () => new Promise(function () { }),
            setEtatId: () => new Promise(function () { }),
            getUsersAndRefresh: () => new Promise(function () { }),
            setOrderBy: () => new Promise(function () { }),
            setSortDir: () => new Promise(function () { }),
            setTotal: () => function () { },
          }}
        />
      </table>
    );

    // THEN
    const dateDeCreationHeader = screen.getByRole("columnheader", { name: /Date de création/i });
    expect(dateDeCreationHeader).toBeInTheDocument();
  });
});
