import { getRequest } from '../../api';

export async function getMembershipPlanHandler({ privateUrl, url }) {
  return await getRequest({ customAxios: privateUrl, url });
}
