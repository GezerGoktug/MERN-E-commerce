import styles from "./Orders.module.scss";
import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { IOrder } from "../../../types/types";
import OrderItem from "../../common/OrderItem/OrderItem";

const Orders = () => {
  const { data } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => {
      return api.get("/order/admin/list");
    },
  });
  return (
    <div className={styles.orders}>
      {data?.data.map((order: IOrder) => (
        <OrderItem isAdminOrder key={order._id} order={order} />
      ))}
    </div>
  );
};

export default Orders;
