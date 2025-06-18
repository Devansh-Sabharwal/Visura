# @router.get('/{chatId}/messages')
# async def get_chat_messages(chatId: str, session: Session = Depends(get_session)):
#     """Get all messages for a chat"""
#     messages = session.exec(
#         select(Message)
#         .where(Message.chatId == chatId)
#         .where(Message.role.in_(["user", "assistant", "system"]))
#         .order_by(Message.created_at)
#     ).all()
    
#     return {
#         "chatId": chatId,
#         "messages": [
#             {
#                 "role": msg.role,
#                 "content": msg.content,
#                 "timestamp": msg.created_at
#             }
#             for msg in messages
#         ]
#     }