import { IoIosStar, IoMdTrash } from "react-icons/io";
import styles from "./Reviews.module.scss";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { createRatingArray } from "../../../../helper/createRatingArray";
import { ReviewType } from "../../../../types/product.type";
import Dropdown from "../../../ui/Dropdown/Dropdown";
import { HiDotsVertical } from "react-icons/hi";
import { GoPencil } from "react-icons/go";
import { lazy, Suspense, useState } from "react";
import { useAccount } from "../../../../store/auth/hooks";

const Modal = lazy(() => import("../../../ui/Modal/Modal"));
const EditReviewModal = lazy(() => import("../EditReviewModal/EditReviewModal"));
const DeleteReviewModal = lazy(() => import("../DeleteReviewModal/DeleteReviewModal"));

interface ModalState<T> {
  modal_type: "DELETE" | "EDIT";
  data: T;
}

export type DeleteReviewModalDTO = Pick<ReviewType, "_id">;

export type EditReviewModalDTO = Pick<ReviewType, "content" | "rating" | "_id">;

const Reviews = ({ reviews }: { reviews: ReviewType[] }) => {
  dayjs.extend(relativeTime);

  const user = useAccount();

  const [modal, setModal] = useState<ModalState<
    EditReviewModalDTO | DeleteReviewModalDTO
  > | null>(null);

  return (
    <div className={styles.reviews_wrapper}>
      <Suspense fallback={<div></div>}>
      <Modal
        open={modal?.modal_type === "EDIT"}
        closeModal={() => setModal(null)}
      >
        <EditReviewModal
          closeModal={() => setModal(null)}
          data={modal?.data as EditReviewModalDTO}
        />
      </Modal>
      <Modal
        open={modal?.modal_type === "DELETE"}
        closeModal={() => setModal(null)}
      >
        <DeleteReviewModal
          closeModal={() =>setModal(null)}
          data={modal?.data as DeleteReviewModalDTO}
        />
      </Modal>

      </Suspense>
      <h5>{reviews.length} Reviews</h5>
      <div className={styles.reviews}>
        {reviews.map((item) => (
          <div key={item._id} className={styles.review_item}>
            <img src={item.user.image} alt="" />
            <div className={styles.review_item_right}>
              <div className={styles.review_item_infos}>
                <h6>{item.user.name}</h6>
                <div>&#9679;</div>
                <span>{dayjs(item.createdAt).fromNow()}</span>
                {user?.email === item.user.email && (
                  <Dropdown
                    trigger={<HiDotsVertical size={20} />}
                    listItems={[
                      {
                        icon: <IoMdTrash />,
                        label: "Delete",
                        onClick: () =>
                          setModal({
                            modal_type: "DELETE",
                            data: {
                              _id: item._id,
                            },
                          }),
                      },
                      {
                        icon: <GoPencil />,
                        label: "Update",
                        onClick: () =>
                          setModal({
                            modal_type: "EDIT",
                            data: {
                              _id: item._id,
                              content: item.content,
                              rating: item.rating,
                            },
                          }),
                      },
                    ]}
                    className={styles.review_dropdown}
                  />
                )}
              </div>
              <div className={styles.review_item_stars}>
                {createRatingArray(item.rating).map((rating, i) => (
                  <IoIosStar
                    key={"review_" + i}
                    size={18}
                    className={clsx(styles.review_item_star_icon, {
                      [styles.starred]: rating,
                    })}
                  />
                ))}
              </div>
              <p className={styles.review_item_content}>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
