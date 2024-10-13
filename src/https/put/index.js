import { putRequest } from '../../api';

export async function updateMemberPlanHandler({ customAxios, payload, url }) {
  return await putRequest({ url, payload, customAxios });
}
