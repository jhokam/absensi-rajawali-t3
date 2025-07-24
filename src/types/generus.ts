import z from "zod";
import type { GenerusUncheckedCreateInput } from "../generated/client/models";
import { filterBase } from "./api";

export const generusCreateSchema = z.object({
	nama: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(255, "Nama maksimal 255 karakter"),
	jenis_kelamin: z.enum(["Laki_Laki", "Perempuan"], {
		error: "Jenis Kelamin tidak boleh kosong",
	}),
	tempat_lahir: z
		.string()
		.nonempty("Tempat Lahir tidak boleh kosong")
		.max(50, "Tempat Lahir maksimal 50 karakter"),
	tanggal_lahir: z.coerce.date(),
	jenjang: z.enum(["Paud", "Caberawit", "Pra_Remaja", "Remaja", "Pra_Nikah"], {
		error: "Jenjang tidak boleh kosong",
	}),
	nomer_whatsapp: z.string().max(15, "Nomor WhatsApp maksimal 15 karakter"),
	// .optional(),
	pendidikan_terakhir: z.enum(
		["PAUD", "TK", "SD", "SMP", "SMA_SMK", "D1_D3", "S1_D4", "S2", "S3"],
		{
			error: "Pendidikan Terakhir tidak boleh kosong",
		},
	),
	nama_orang_tua: z.string(),
	// .optional(),
	nomer_whatsapp_orang_tua: z.string(),
	// .optional(),
	sambung: z.enum(["Aktif", "Tidak_Aktif"], {
		error: "Sambung tidak boleh kosong",
	}),
	// .default("Tidak_Aktif"),
	alamat_tempat_tinggal: z.string().nonempty("Alamat tidak boleh kosong"),
	keterangan: z.enum(["Pendatang", "Pribumi"], {
		error: "Keterangan tidak boleh kosong",
	}),
	alamat_asal: z.string(),
	// .optional(),
	kelompok_id: z.string().nonempty("Kelompok tidak boleh kosong"),
});

export const generusUpdateSchema = generusCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const generusDeleteSchema = generusUpdateSchema.pick({
	id: true,
});

export const generusFilter = filterBase.extend({
	jenis_kelamin: z.enum(["Laki_Laki", "Perempuan"]).optional(),
	jenjang: z
		.enum(["Paud", "Caberawit", "Pra_Remaja", "Remaja", "Pra_Nikah"])
		.optional(),
	pendidikan_terakhir: z
		.enum(["PAUD", "TK", "SD", "SMP", "SMA_SMK", "D1_D3", "S1_D4", "S2", "S3"])
		.optional(),
	sambung: z.enum(["Aktif", "Tidak_Aktif"]).optional(),
	keterangan: z.enum(["Pendatang", "Pribumi"]).optional(),
	kelompok_id: z.string().optional(),
});

export const defaultGenerus: GenerusUncheckedCreateInput = {
	nama: "",
	jenis_kelamin: "Laki_Laki",
	tempat_lahir: "",
	tanggal_lahir: new Date(),
	jenjang: "Paud",
	nomer_whatsapp: "",
	pendidikan_terakhir: "PAUD",
	nama_orang_tua: "",
	nomer_whatsapp_orang_tua: "",
	sambung: "Tidak_Aktif",
	alamat_tempat_tinggal: "",
	keterangan: "Pendatang",
	alamat_asal: "",
	kelompok_id: "",
};
