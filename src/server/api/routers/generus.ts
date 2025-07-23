import type { GenerusWhereInput } from "@/generated/client/models";
import { formatResponseArray } from "@/helper/response.helper";
import { generusFilter } from "../../../types/generus";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const generusRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const generus = await ctx.db.generus.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Generus",
			{
				items: generus,
				meta: {
					limit: generus.length,
					page: 1,
					total: generus.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(generusFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const where: GenerusWhereInput = {
				AND: [
					{
						nama: {
							contains: input.q,
							mode: "insensitive",
						},
					},
					{
						jenis_kelamin: {
							equals: input.jenis_kelamin,
						},
					},
					{
						jenjang: {
							equals: input.jenjang,
						},
					},
					{
						pendidikan_terakhir: {
							equals: input.pendidikan_terakhir,
						},
					},
					{
						sambung: {
							equals: input.sambung,
						},
					},
					{
						keterangan: {
							equals: input.keterangan,
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.generus.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.generus.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Generus",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),
});
