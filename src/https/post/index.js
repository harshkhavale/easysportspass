import { postRequest } from '../../api';

export async function createMemberShipPlan({ privateAxios, payload, url }) {
  return await postRequest({ url, customAxios: privateAxios, data: payload });
}
