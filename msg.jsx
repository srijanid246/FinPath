function Message({ sender, text }) {

  return (
    <div
      className={
        sender === "user"
          ? "user-message"
          : "ai-message"
      }
    >
      {text}
    </div>
  );
}

export default Message;