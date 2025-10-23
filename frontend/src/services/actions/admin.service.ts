import { IResponse } from "../../types/common.type";
import api from "../../utils/api";
import { IAdminStatResponse } from "../../types/admin.type";


const getAdminStatistics = (): Promise<IResponse<IAdminStatResponse>> => api.get("/admin/stats");

const AdminService = {
    getAdminStatistics
}

export default AdminService;