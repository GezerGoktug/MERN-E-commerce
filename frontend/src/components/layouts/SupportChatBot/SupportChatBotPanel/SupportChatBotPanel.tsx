import { BiSolidDownArrow, BiSolidSend } from 'react-icons/bi'
import styles from './SupportChatBotPanel.module.scss'
import { MdInput, MdKeyboardVoice } from 'react-icons/md'
import Input from '../../../ui/Input/Input'
import { FaSquare, FaXmark } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import { RiGeminiFill } from 'react-icons/ri'
import { IoIosStar, IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import clsx from 'clsx'
import { useMediaQuery } from 'react-responsive'
import OutsideClickHandler from 'react-outside-click-handler'
import { useEffect, useRef, useState } from 'react'
import useSpeechRecognition from '../../../../hooks/use-speech-recognition'
import toast from 'react-hot-toast'
import { useAskQuestionToAiChatbotMutation } from '../../../../services/hooks/mutations/ai.mutations'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { AxiosError } from 'axios'
import { ExtendedProductType } from '../../../../types/product.type'
import { Link } from 'react-router-dom'
import { useIsProductsInFavQuery } from '../../../../services/hooks/queries/product.query'
import { isAccess } from '../../../../store/auth/hooks'
import { useHandleFavouriteMutation } from '../../../../services/hooks/mutations/product.mutations'
import getSize from '../../../../helper/getSize'
import { MessageType } from '../../../../types/ai.type'
import { useGetAiConversationThreadByThreadIdQuery } from '../../../../services/hooks/queries/ai.query'

const exampleQuestions = [
    // 🔹 Product & Search (productLookupTool)
    [
        "Can you show me affordable winterwear for men under $60?",
        "Find kids' topwear with the highest ratings.",
        "Show me women's dresses sorted by newest arrivals.",
    ],
    [
        "What are the best-rated products in the men's collection?",
        "Find winterwear for women priced between $50 and $120.",
        "Show me kids’ bottomwear available in size SMALL.",
    ],
    [
        "List top 5 products related to 'denim jackets' for men.",
        "Find eco-friendly coats for women under $100.",
        "Show me the latest arrivals in the Kids category.",
    ],

    // 🔹 Brand & Company (PDF: Company Profile)
    [
        "Who is FOREVER as a brand?",
        "What makes FOREVER’s clothing sustainable?",
        "What is FOREVER’s mission and vision?",
    ],
    [
        "Where are FOREVER’s products manufactured?",
        "When was FOREVER established?",
        "What does FOREVER mean by 'timeless fashion'?",
    ],

    // 🔹 Shipping, Returns & Orders (PDF: FAQ)
    [
        "How long does delivery take?",
        "Do you ship internationally?",
        "How can I track my order?",
    ],
    [
        "What is the return policy?",
        "Can I exchange an item for a different size?",
        "How can I report a damaged product?",
    ],
    [
        "What payment methods do you accept?",
        "Can I cancel or modify my order?",
        "Do you offer gift wrapping options?",
    ],

    // 🔹 Promotions & Membership
    [
        "Do you offer discounts or seasonal sales?",
        "Is there a loyalty or membership program?",
        "How can I get notified about upcoming promotions?",
    ],

    // 🔹 Contact & Support
    [
        "How can I contact FOREVER support?",
        "What is the customer service email?",
        "Do you have social media accounts I can follow?",
    ]
];

const AiAdviseProductItem = ({ product }: { product: ExtendedProductType & { averageRating: number, isFav: boolean } }) => {

    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        setIsFav(product.isFav);
    }, [product.isFav])

    useEffect(() => {
        if (!isAccess()) {
            setIsFav(false)
        }
    }, [isAccess()])

    const { mutate } = useHandleFavouriteMutation({
        onSuccess: async (data) => {
            toast.success(data.data.message);
            setIsFav(!isFav);
        },
        onError: (error) => {
            setIsFav(!isFav);
            const apiError = error?.response?.data?.error.errorMessage;
            if (typeof apiError === "string") toast.error(apiError);
        }
    });

    const toggleFavourite = () => isAccess() ? mutate({ isFav, productId: product._id }) : toast.error('Please you login for add product to your favourites');
    return (
        <Link to={`/product/${product._id}`}>
            <div className={styles.support_chatbot_panel_products}>
                <div className={styles.support_chatbot_panel_product}>
                    <img src={product.image} alt={product.name} />
                    <div className={styles.support_chatbot_panel_product_info}>
                        <h6>{product.name}</h6>
                        <div className={styles.support_chatbot_panel_product_price_and_rating}>
                            <span>${product.price}</span>
                            <div className={styles.support_chatbot_panel_product_avg_rating}>
                                <IoIosStar />
                                {product.averageRating}
                            </div>

                        </div>
                        <div className={styles.support_chatbot_panel_product_sizes}>
                            {
                                product.sizes.map((size) => (
                                    <div>{getSize(size)}</div>
                                ))
                            }
                        </div>
                    </div>
                    <div className={styles.support_chatbot_panel_product_actions}>
                        <div onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavourite()
                        }}>
                            {isFav ? <IoMdHeart fill="red" size={20} /> : <IoMdHeartEmpty size={20} />}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
const AiAdviseProducts = ({ msg }: { msg: MessageType & { isFirstMessage?: boolean } }) => {

    const { data } = useIsProductsInFavQuery(msg.type === "ai" ? msg.products?.map(p => p._id) : [], ["ai-chatbot-fav-product"], {
        enabled: isAccess() && msg.type === "ai" && !!msg.products?.length
    })

    const isFavProduct = (id: string) => data?.data.find(dt => dt._id === id)?.isFav;

    return msg.type === "ai" && msg.products.map((product) => <AiAdviseProductItem product={{ ...product, isFav: isFavProduct(product._id) || false }} key={`ai-product-${product._id}`} />)

}

const triggerAutoSizeTextArea = () => {
    const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>("#chatbotInput");

    if (el) {
        setTimeout(() => {
            const event = new Event("input", { bubbles: true });
            el.dispatchEvent(event);
        }, 10)
    }
}

const SupportChatBotPanel = ({ setShow }: { setShow: React.Dispatch<boolean> }) => {

    const [threadId, setThreadId] = useState<string | null>(null);

    useEffect(() => {
        if (sessionStorage.getItem("aiChatBotThreadId")) {
            setThreadId(sessionStorage.getItem("aiChatBotThreadId") as string);
        }
    }, []);

    const { data } = useGetAiConversationThreadByThreadIdQuery(threadId as string, {
        enabled: !!threadId,
        refetchOnWindowFocus:false,
    });
    

    const ramdomNumber = useRef(Math.floor(Math.random() * 10));

    const [text, setText] = useState("");
    const [messages, setMessages] = useState<(MessageType & { isFirstMessage?: boolean })[]>([])

    useEffect(() => {
        if (data?.data && data?.data.length > 0) {
            setMessages([...data.data, {
                type: "ai",
                isFirstMessage: true,
                message: "Hello 👋, I'm Sora, your e-commerce store assistant 😊. How can I help you? Here are some sample questions you can ask me:",
                products: [],
            }])
        }
        else {
            setMessages([{
                type: "ai",
                isFirstMessage: true,
                message: "Hello 👋, I'm Sora, your e-commerce store assistant 😊. How can I help you? Here are some sample questions you can ask me:",
                products: [],
            }])
        }
    }, [data])


    const isSmallDevices = useMediaQuery({ query: "(max-width: 550px) and (min-width:400px)" })
    const isXSmallDevices = useMediaQuery({ query: "(max-width: 400px)", })

    const { isListening, startListening, stopListening, error, speechData } = useSpeechRecognition(text);

    const { mutateAsync, isPending } = useAskQuestionToAiChatbotMutation({
        onSuccess(data) {
            setMessages(prv => [...prv, { type: "ai", message: data.data.message, products: data.data.products }])
            if (!threadId) {
                sessionStorage.setItem("aiChatBotThreadId", data.data.threadId)
                setThreadId(data.data.threadId)
            }
            setText("");
            triggerAutoSizeTextArea()
        },
        onError(error) {
            const apiError = error?.response?.data?.error.errorMessage;
            if (typeof apiError === "string") toast.error(apiError);
            if (apiError && typeof apiError === "object") {
                Object.entries(apiError).forEach(([key, value]) => {
                    value.forEach((val) => {
                        toast.error(`${key} : ${val}`);
                    });
                });
            }
        }
    })

    useEffect(() => {
        if (speechData && isListening) {
            setText(speechData)
        }
    }, [speechData, isListening])

    useEffect(() => {
        if (error)
            toast.error(error)

    }, [error])

    useEffect(() => {
        if (speechData && isListening) {
            triggerAutoSizeTextArea()
        }
    }, [speechData, isListening]);



    const getPanelWidthSize = () => {
        if (isSmallDevices) {
            return "90vw"
        } else if (isXSmallDevices) {
            return "100vw";
        }
        else {
            return "400px"
        }
    }


    const handleClickRandomQuestionBtn = (question:string) => {
        setText(question);
        setTimeout(async () => {
            await askQuestionToChatbot(question)
        }, 500);
    }

    const askQuestionToChatbot = async (question?:string) => {

        const notUpdatedMessages = [...messages]

        try {
            setMessages((prv) => [...prv, {
                type: "human",
                message: question || text
            }])
            await mutateAsync({ question: question || text, ...(threadId && { threadId }) })
        } catch (error) {
            setMessages(notUpdatedMessages)
            if (error instanceof AxiosError) {
                const apiError = error?.response?.data?.error.errorMessage;
                if (typeof apiError === "string") toast.error(apiError);
                if (apiError && typeof apiError === "object") {
                    Object.entries(apiError).forEach(([key, value]) => {
                        (value as string[]).forEach((val) => {
                            toast.error(`${key} : ${val}`);
                        });
                    });
                }
            }
        }
    }

    return (
        <OutsideClickHandler onOutsideClick={() => isXSmallDevices ? setShow(false) : null}>
            <motion.div
                initial={{ width: 0, opacity: 0, ...(isXSmallDevices && { top: "70vh" }) }}
                animate={{ width: getPanelWidthSize(), opacity: 1, ...(isXSmallDevices && { top: 0 }) }}
                exit={{ width: 0, opacity: 0, ...(isXSmallDevices && { top: "70vh" }), transition: { width: { delay: 0.4 }, opacity: { delay: 0.3 }, ...(isXSmallDevices && { top: { delay: 0 } }) } }}
                transition={{ width: { duration: 0.4 }, opacity: { duration: 0.5 }, ...(isXSmallDevices && { top: { duration: 0.4, delay: 0.5 } }), }}
                className={styles.support_chatbot_panel}>

                <div className={styles.support_chatbot_panel_content}>
                    <div className={styles.support_chatbot_panel_top}>
                        <div className={styles.support_chatbot_panel_top_left}>
                            <div className={styles.support_chatbot_panel_top_left_avatar}>
                                <RiGeminiFill className={styles.agent_icon} />
                                <img src="/agent.png" alt="agent" />
                            </div>
                            <div className={styles.support_chatbot_panel_agent_infos}>
                                <h6>Sora</h6>
                                <span>AI Helpful E-commerce Assistant</span>
                            </div>

                        </div>
                        <div className={styles.support_chatbot_panel_top_right}>
                            <div onClick={() => setShow(false)} className={styles.support_chatbot_panel_top_close_btn}>
                                <FaXmark size={20} />
                            </div>
                        </div>
                    </div>
                    <motion.div
                        initial={{ maxHeight: isXSmallDevices ? 0 : "65px" }}
                        animate={{ maxHeight: isXSmallDevices ? "70vh" : "400px" }}
                        exit={{ maxHeight: isXSmallDevices ? 0 : "65px", transition: { delay: 0 } }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        className={styles.support_chatbot_panel_message_history}
                        id='messageHistory'
                    >
                        <motion.div
                            initial={{ display: "none" }}
                            animate={{ display: "block" }}
                            exit={{ display: "none", transition: { display: { delay: 0 } } }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            style={{ height: isXSmallDevices ? "70vh" : "400px" }}
                        >
                            {
                                messages.map((msg, i) => (
                                    <motion.div
                                        key={`chatbot-message-`+ msg.products + "-" + i}
                                        {...(msg.isFirstMessage ? {
                                            initial: { x: -10, opacity: 0 },
                                            animate: { x: 0, opacity: 1 },
                                            transition: { duration: 0.4, delay: 1 }
                                        } : null)}
                                        className={clsx(styles.support_chatbot_panel_message_item, { [styles.is_my_message]: msg.type === "human" })}
                                    >
                                        <div className={clsx(styles.support_chatbot_panel_message, { [styles.is_my_message]: msg.type === "human" })}>
                                            {msg.type === "ai" && <img src="/agent.png" alt="" />}
                                            <p>{msg.message}</p>
                                        </div>
                                        {
                                            msg.isFirstMessage &&
                                            <div className={styles.support_chatbot_panel_example_questions}>
                                                {
                                                    exampleQuestions[ramdomNumber.current].map((question, i) => (
                                                        <motion.div
                                                            initial={{ x: -10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ duration: 0.4, delay: 1 + ((i + 1) * 0.2) }}
                                                            className={styles.support_chatbot_panel_example_question}
                                                            onClick={() => handleClickRandomQuestionBtn(question)}
                                                        >
                                                            <span>{question}</span>
                                                            <MdInput size={20} />
                                                        </motion.div>

                                                    ))
                                                }
                                            </div>
                                        }
                                        <AiAdviseProducts msg={msg} />

                                    </motion.div>

                                ))
                            }
                            {
                                isPending && (
                                    <motion.div
                                        className={styles.support_chatbot_panel_skeleton_message_wrapper}
                                    >
                                        <div className={styles.support_chatbot_panel_skeleton_message}>
                                            <img src="/agent.png" alt="" />
                                            <div className={styles.support_chatbot_panel_skeletons_text}>
                                                <div />
                                                <div />
                                                <div />
                                                <div />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            }
                        </motion.div>
                    </motion.div>
                    <div className={styles.support_chatbot_panel_bottom}>
                        <Input
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                            className={styles.support_chatbot_panel_bottom_input}
                            inputClassName={styles.support_chatbot_panel_bottom_input_item}
                            isAutoSize
                            placeholder='Enter a word'
                            {...(text.trim().length > 1 && { rightIcon: FaXmark })}
                            rightIconOnClick={() => {
                                setText("")
                                triggerAutoSizeTextArea()
                            }}
                            id='chatbotInput'
                        />
                        <div
                            onClick={() => isListening ? stopListening() : startListening()}
                            className={clsx(styles.support_chatbot_panel_bottom_action_btn, { [styles.is_listening]: isListening })}>
                            {
                                isListening ? <FaSquare size={20} /> : <MdKeyboardVoice size={20} />
                            }
                        </div>
                        <div onClick={() => askQuestionToChatbot()} className={styles.support_chatbot_panel_bottom_action_btn}>
                            {isPending ? <AiOutlineLoading3Quarters className={styles.support_chatbot_panel_bottom_loading} size={20} /> : <BiSolidSend size={20} />}
                        </div>
                    </div>
                </div>
                <BiSolidDownArrow size={40} className={styles.support_chatbot_panel_arrow} />
            </motion.div >

        </OutsideClickHandler >
    )

}

export default SupportChatBotPanel