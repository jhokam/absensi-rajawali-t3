import z from "zod";

export const generusSchema = z.object({
	nama: z.string().nonempty("Nama tidak boleh kosong"),
	jenis_kelamin: z.enum(["Laki_Laki", "Perempuan"], {
		error: "Jenis Kelamin tidak boleh kosong",
	}),
	tempat_lahir: z.string().nonempty("Tempat Lahir tidak boleh kosong"),
	tanggal_lahir: z.date({
		error: "Tanggal Lahir tidak boleh kosong",
	}),
	jenjang: z.enum(["Paud", "Caberawit", "Pra_Remaja", "Remaja", "Pra_Nikah"], {
		error: "Jenjang tidak boleh kosong",
	}),
	nomer_whatsapp: z.string().nonempty("Nomor WhatsApp tidak boleh kosong"),
	pendidikan_terakhir: z.enum(
		["PAUD", "TK", "SD", "SMP", "SMA_SMK", "D1_D3", "S1_D4", "S2", "S3"],
		{
			error: "Pendidikan Terakhir tidak boleh kosong",
		},
	),
	nama_orang_tua: z.string().nonempty("Nama Orang Tua tidak boleh kosong"),
	nomer_whatsapp_orang_tua: z
		.string()
		.nonempty("Nomor WhatsApp Orang Tua tidak boleh kosong"),
	sambung: z.enum(["Aktif", "Tidak_Aktif"], {
		error: "Sambung tidak boleh kosong",
	}),
	alamat_tempat_tinggal: z.string().nonempty("Alamat tidak boleh kosong"),
	keterangan: z.enum(["Pendatang", "Pribumi"], {
		error: "Keterangan tidak boleh kosong",
	}),
	alamat_asal: z.string().nonempty("Alamat Asal tidak boleh kosong"),
	kelompok_id: z.string().nonempty("Kelompok tidak boleh kosong"),
});

export type GenerusRequest = z.infer<typeof generusSchema>;

export const generusFilter = z.object({
	q: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
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

export const idSchema = z.object({
	id: z.string().nonempty("ID tidak boleh kosong"),
});
