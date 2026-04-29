import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, NextAuthOptions } from "next-auth";

import handler from "./update";
import { getUserByCodeEndpoint } from "../../../backend/infrastructure/controllers/getUserByCodeEndpoint";
import { updateUserEndpoint } from "../../../backend/infrastructure/controllers/updateUserEndpoint";
import { Dependencies } from "../../../backend/infrastructure/dependencies";
import { checkAdminRole } from "../../../checkAdminMiddleware";
import { Role, RoleLabel } from "../../../commons/Role";

jest.mock("next-auth", (): { getServerSession: typeof getServerSession } => ({ getServerSession: jest.fn(), }));
jest.mock("../../../backend/infrastructure/controllers/getUserByCodeEndpoint");
jest.mock("../../../backend/infrastructure/controllers/updateUserEndpoint");
jest.mock("../../../backend/infrastructure/dependencies", (): { dependencies: Dependencies } => ({ 
  dependencies: { 
    logger: {
      error: jest.fn(),
      audit: jest.fn(),
    }
  } as unknown as Dependencies,
}));
jest.mock("../../../checkAdminMiddleware");
jest.mock("../auth/[...nextauth]", (): { authOptions: NextAuthOptions } => ({ authOptions: {} as NextAuthOptions, }));

const mockGetServerSession = jest.mocked(getServerSession);
const mockGetUserByCodeEndpoint = jest.mocked(getUserByCodeEndpoint);
const mockUpdateUserEndpoint = jest.mocked(updateUserEndpoint);
const mockCheckAdminRole = jest.mocked(checkAdminRole);

function createMockRequest(body: Record<string, unknown>): NextApiRequest {
  return {
    method: "POST",
    body,
  } as unknown as NextApiRequest;
}

function createMockResponse(): NextApiResponse & { _status: number; _json: unknown; _sent: unknown } {
  const res = {
    _status: 0,
    _json: undefined as unknown,
    _sent: undefined as unknown,
    status(code: number) {
      res._status = code;
      return res;
    },
    json(data: unknown) {
      res._json = data;
      return res;
    },
    send(data: unknown) {
      res._sent = data;
      return res;
    },
  };
  return res as unknown as NextApiResponse & { _status: number; _json: unknown; _sent: unknown };
}

describe("PUT /api/utilisateurs/update - privilege escalation prevention", () => {
  const existingRegularUser = {
    roleId: String(Role.USER),
  };

  beforeEach(() => {
    mockCheckAdminRole.mockResolvedValue(true);
    mockGetUserByCodeEndpoint.mockResolvedValue(existingRegularUser as any);
    mockUpdateUserEndpoint.mockResolvedValue(undefined);
  });

  describe("ADMIN_REG role assignment restrictions", () => {
    beforeEach(() => {
      mockGetServerSession.mockResolvedValue({
        user: { role: Role.ADMIN_REG, idUser: "admin-reg-user" },
      } as any);
    });

    it("should return 403 when ADMIN_REG tries to assign ADMIN_NAT role", async () => {
      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.ADMIN_NAT,
        institutionCode: "ARS-01",
        profilsCode: ["profil1"],
        firstname: "John",
        lastname: "Doe",
      });
      const res = createMockResponse();

      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(403);
      expect(res._sent).toBe("Forbidden");
      expect(mockUpdateUserEndpoint).not.toHaveBeenCalled();
    });

    it("should return 403 when ADMIN_REG tries to assign ADMIN_CENTR role", async () => {
      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.ADMIN_CENTR,
        institutionCode: "ARS-01",
        profilsCode: ["profil1"],
        firstname: "John",
        lastname: "Doe",
      });
      const res = createMockResponse();

      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(403);
      expect(res._sent).toBe("Forbidden");
      expect(mockUpdateUserEndpoint).not.toHaveBeenCalled();
    });

    it("should return 403 when ADMIN_REG tries to assign SCN institution", async () => {
      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.ADMIN_REG,
        institutionCode: "SCN",
        profilsCode: ["profil1"],
        firstname: "John",
        lastname: "Doe",
      });
      const res = createMockResponse();

      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(403);
      expect(res._sent).toBe("Forbidden");
      expect(mockUpdateUserEndpoint).not.toHaveBeenCalled();
    });

    it("should return 403 when ADMIN_REG tries to assign ADMIN_CENTR institution", async () => {
      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.ADMIN_REG,
        institutionCode: "ADMIN_CENTR",
        profilsCode: ["profil1"],
        firstname: "John",
        lastname: "Doe",
      });
      const res = createMockResponse();

      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(403);
      expect(res._sent).toBe("Forbidden");
      expect(mockUpdateUserEndpoint).not.toHaveBeenCalled();
    });

    it("should allow ADMIN_REG to assign USER role with regional institution", async () => {
      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.USER,
        institutionCode: "ARS-01",
        profilsCode: ["profil1"],
        firstname: "John",
        lastname: "Doe",
      });
      const res = createMockResponse();

      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(200);
      expect(mockUpdateUserEndpoint).toHaveBeenCalledWith(expect.objectContaining({ logger: expect.any(Object) }), "target-user", RoleLabel.USER, "ARS-01", ["profil1"], "John", "Doe");
    });

    it("should allow ADMIN_REG to assign ADMIN_REG role with regional institution", async () => {
      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.ADMIN_REG,
        institutionCode: "ARS-01",
        profilsCode: ["profil1"],
        firstname: "John",
        lastname: "Doe",
      });
      const res = createMockResponse();

      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(200);
      expect(mockUpdateUserEndpoint).toHaveBeenCalledWith(expect.objectContaining({ logger: expect.any(Object) }), "target-user", RoleLabel.ADMIN_REG, "ARS-01", ["profil1"], "John", "Doe");
    });

    it("should allow ADMIN_REG to update user with existing SCN institution", async () => {
      // Mock the ADMIN_REG session with matching institutionId
      mockGetServerSession.mockResolvedValueOnce({
        user: { role: Role.ADMIN_REG, idUser: "admin-reg-user", institutionId: 1 },
      } as any);

      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.USER,
        institutionCode: "SCN",
        profilsCode: ["profil1"],
        firstname: "Jean",
        lastname: "Doe",
      });

      // Mock the user to already have SCN institution
      mockGetUserByCodeEndpoint.mockResolvedValueOnce({
        roleId: String(Role.USER),
        institutionId: 1,
        institution: {
          id: 1,
          code: "SCN",
          libelle: "Service Central National",
          codeGeo: "00"
        }
      } as any);

      const res = createMockResponse();
      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(200);
      expect(mockUpdateUserEndpoint).toHaveBeenCalledWith(expect.objectContaining({ logger: expect.any(Object) }), "target-user", RoleLabel.USER, "SCN", ["profil1"], "Jean", "Doe");
    });

    it("should allow ADMIN_REG to update user with existing ADMIN_CENTR institution", async () => {
      // Mock the ADMIN_REG session with matching institutionId
      mockGetServerSession.mockResolvedValueOnce({
        user: { role: Role.ADMIN_REG, idUser: "admin-reg-user", institutionId: 2 },
      } as any);

      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.USER,
        institutionCode: "ADMIN_CENTR",
        profilsCode: ["profil1"],
        firstname: "Jane",
        lastname: "Smith",
      });

      // Mock the user to already have ADMIN_CENTR institution
      mockGetUserByCodeEndpoint.mockResolvedValueOnce({
        roleId: String(Role.USER),
        institutionId: 2,
        institution: {
          id: 2,
          code: "ADMIN_CENTR",
          libelle: "Administration Centrale",
          codeGeo: "00"
        }
      } as any);

      const res = createMockResponse();
      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(200);
      expect(mockUpdateUserEndpoint).toHaveBeenCalledWith(expect.objectContaining({ logger: expect.any(Object) }), "target-user", RoleLabel.USER, "ADMIN_CENTR", ["profil1"], "Jane", "Smith");
    });
  });

  describe("ADMIN_NAT role assignment permissions", () => {
    beforeEach(() => {
      mockGetServerSession.mockResolvedValue({
        user: { role: Role.ADMIN_NAT, idUser: "admin-nat-user" },
      } as any);
    });

    it("should allow ADMIN_NAT to assign ADMIN_NAT role", async () => {
      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.ADMIN_NAT,
        institutionCode: "SCN",
        profilsCode: ["profil1"],
        firstname: "John",
        lastname: "Doe",
      });
      const res = createMockResponse();

      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(200);
      expect(mockUpdateUserEndpoint).toHaveBeenCalledWith(expect.objectContaining({ logger: expect.any(Object) }), "target-user", RoleLabel.ADMIN_NAT, "SCN", ["profil1"], "John", "Doe");
    });

    it("should allow ADMIN_NAT to assign ADMIN_CENTR role", async () => {
      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.ADMIN_CENTR,
        institutionCode: "ADMIN_CENTR",
        profilsCode: ["profil1"],
        firstname: "John",
        lastname: "Doe",
      });
      const res = createMockResponse();

      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(200);
      expect(mockUpdateUserEndpoint).toHaveBeenCalledWith(expect.objectContaining({ logger: expect.any(Object) }), "target-user", RoleLabel.ADMIN_CENTR, "ADMIN_CENTR", ["profil1"], "John", "Doe");
    });

    it("should allow ADMIN_NAT to assign SCN institution", async () => {
      const req = createMockRequest({
        userCode: "target-user",
        roleCode: RoleLabel.ADMIN_REG,
        institutionCode: "SCN",
        profilsCode: ["profil1"],
        firstname: "John",
        lastname: "Doe",
      });
      const res = createMockResponse();

      await handler(req, res as unknown as NextApiResponse);

      expect(res._status).toBe(200);
      expect(mockUpdateUserEndpoint).toHaveBeenCalledWith(expect.objectContaining({ logger: expect.any(Object) }), "target-user", RoleLabel.ADMIN_REG, "SCN", ["profil1"], "John", "Doe");
    });
  });
});
