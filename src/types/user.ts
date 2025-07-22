import z from "zod";
import type { UserCreateInput } from "../generated/client/models";

export const userSchema = z.object({
	username: z.string().nonempty("Username tidak boleh kosong"),
	password: z.string().nonempty("Password tidak boleh kosong"),
	role: z.enum(["Admin", "User"], {
		error: "Role tidak boleh kosong",
	}),
});

export const defaultValueUser: UserCreateInput = {
	username: "",
	password: "",
	role: "User",
};

export const userFilter = z.object({
	q: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	role: z.enum(["Admin", "User"]).optional(),
});
