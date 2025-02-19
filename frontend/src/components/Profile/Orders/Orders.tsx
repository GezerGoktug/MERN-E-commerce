import { BsBorderWidth } from "react-icons/bs";
import styles from "./Orders.module.scss";
import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import OrderItem from "../../common/OrderItem/OrderItem";
import { IOrder } from "../../../types/types";

const Orders = () => {
  const { data } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => {
      return api.get("/order/my-order");
    },
  });

  return (
    <div className={styles.orders_wrapper}>
      <div className={styles.orders_btn}>
        <BsBorderWidth className={styles.orders_btn_icon} size={30} />
        <span>Orders</span>
      </div>
      <hr />
      <div className={styles.orders}>
        {data?.data.map((order: IOrder) => (
          <OrderItem key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
