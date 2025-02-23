import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
// import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("message/user")
            const { filteredUsers } = res.data; // Extract the filteredUsers array
            set({ users: filteredUsers });
        }
        catch (err) {
            toast.error("Error in the getUsers" + err.response.data.message)
        }
        finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`message/${userId}`)
            set({ messages: res.data })
        }
        catch (err) {
            toast.error("error in the getMessages" + err.response.data.message);
        }
        finally {
            set({ isMessageLoading: false })
        }
    },


    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },



    sendMessage: async (data) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`message/send/${selectedUser._id}`, data);
            set({ messages: [...messages, res.data] })
        }
        catch (err) {
            toast.error("error in the sendmessage" + err.response.data.message);
        }
    },

    subscribeToMessage: () => {
        const { selectedUser } = get()
        if (!selectedUser) {
            return;
        }
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },
    unsubscribeForMessage:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
    },


}))
