import { getMessages } from "@/api/messages";
import { useQuery } from "@tanstack/react-query";

export const useMessages = (chatId: string, token: string) => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages(chatId, token),
    enabled: !!chatId && !!token,
  });
};
