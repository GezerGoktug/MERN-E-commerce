import styles from "./CreateReview.module.scss";
import Button from "../../../ui/Button/Button";
import Rating from "./Rating/Rating";
import { useState } from "react";
import { isAccess, useAccount } from "../../../../store/auth/hooks";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateCommentMutation } from "../../../../services/hooks/mutations/product.mutations";

const CreateReview = () => {
  const currentUser = useAccount();
  const params = useParams();
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [clearRating, setClearRating] = useState(false);

  const { mutate, isPending } = useCreateCommentMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      setClearRating(false);
    },
    onError(error) {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
      setClearRating(false);
    },
  })

  const handleComment = () => {
    if (params.id) {
      mutate({
        rating,
        productId: params?.id,
        content,
      });
      setContent("");
      setClearRating(true);
    }
  };
  return (
    <>
      {isAccess() ? (
        <div className={styles.create_review_wrapper}>
          <h5 className={styles.create_review_title}>Create Comment</h5>
          <div className={styles.create_review}>
            <img src={currentUser?.image} alt="" />
            <div className={styles.create_review_right}>
              <h6>{currentUser?.name}</h6>
              <Rating
                clearRating={clearRating}
                rateAction={(rate: number) => setRating(rate)}
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={250}
                placeholder="Enter something "
                name=""
                id=""
              ></textarea>
              <Button
                loading={isPending}
                onClick={() => handleComment()}
                className={styles.create_review_btn}
              >
                SEND
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.create_review_wrapper}>
          <h5 className={styles.create_review_title}>Create Comment</h5>
          <div className={styles.create_review_not_logged_content}>
            <p className={styles.create_review_not_logged_title}>
              You must be logged in to post a comment.
            </p>
            <Link to="/auth">
              <Button>LOGIN</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateReview;
