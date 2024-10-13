import { deleteRequest } from '../../api';

export async function deleteMemberPlanHandler({ customAxios,  url }) {
  return await deleteRequest({ customAxios, url });
}
