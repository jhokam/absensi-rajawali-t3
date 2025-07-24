import z from "zod";
import type { UserCreateInput } from "../generated/client/models";

export const userCreateSchema = z.object({
	username: z
		.string()
		.nonempty("Username tidak boleh kosong")
		.max(50, "Username maksimal 50 karakter"),
	password: z
		.string()
		.nonempty("Password tidak boleh kosong")
		.max(128, "Password maksimal 128 karakter"),
	role: z.enum(["Super_Admin", "Admin", "User"], {
		error: "Role tidak boleh kosong",
	}),
});

export const userUpdateSchema = userCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const userDeleteSchema = userUpdateSchema.pick({
	id: true,
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
	role: z.enum(["Super_Admin", "Admin", "User"]).optional(),
});
