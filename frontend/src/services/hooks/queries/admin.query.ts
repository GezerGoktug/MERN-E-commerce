import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import AdminService from "../../actions/admin.service";
import { IError, IResponse } from "../../../types/common.type";
import { IAdminStatResponse } from "../../../types/admin.type";

const useGetAdminStatisticsQuery = (
    queryOptions?: Omit<UseQueryOptions<IResponse<IAdminStatResponse>, IError>, "queryKey">
) => useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => AdminService.getAdminStatistics(),
    refetchInterval: 1000 * 60 * 10,
    ...queryOptions
});

export { useGetAdminStatisticsQuery };

