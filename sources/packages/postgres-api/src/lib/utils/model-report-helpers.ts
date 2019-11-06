// import { getRepository } from 'typeorm';

// export const getRModelReportWithRelation: (
//   modelId: number,
// ) => Promise<Report | undefined> = async (modelId) => {
//   try {
//     const reportRepo = getRepository(Report);
//     // const query = modelRepo.createQueryBuilder('bathingspot_model')
//     const report = await reportRepo.findOne({
//       where: { modelId: modelId },
//       relations: ['plots'],
//     });
//     return report;
//   } catch (error) {
//     throw error;
//   }
// };
