import { useRef, useState, useEffect } from "react"
import classes from "./contact-form.module.css"
import Notification from "../ui/notification"

async function sendContentData(contactDetails: any) {
  const response = await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify({
      email: contactDetails.enteredEmailValue,
      name: contactDetails.enteredNameValue,
      message: contactDetails.enteredMessageValue,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!")
  }
}

export default function ContactForm() {
  const enteredEmail = useRef<HTMLInputElement>(null)
  const enteredName = useRef<HTMLInputElement>(null)
  const enteredMessage = useRef<HTMLTextAreaElement>(null)

  const [requestStatus, setRequestStatus]: any = useState() // 'pending', 'success', 'error'
  const [requestError, setRequestError]: any = useState()

  useEffect(() => {
    if (requestStatus === "success" || requestStatus === "error") {
      const timer = setTimeout(() => {
        setRequestStatus(null)
        setRequestError(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [requestStatus])

  async function sendMessageHandler(event: React.FormEvent) {
    event.preventDefault()

    const enteredValues = {
      enteredEmailValue: enteredEmail.current?.value,
      enteredNameValue: enteredName.current?.value,
      enteredMessageValue: enteredMessage.current?.value,
    }

    setRequestStatus("pending")

    try {
      await sendContentData(enteredValues)
      setRequestStatus("success")

      enteredEmail.current!.value = ""
      enteredName.current!.value = ""
      enteredMessage.current!.value = ""
    } catch (error: any) {
      setRequestError(error.message)
      setRequestStatus("error")
    }
  }

  let notification

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Sending message...",
      message: "Your message is on its way!",
    }
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: "Message sent successfully!",
    }
  }

  if (requestStatus === "error") {
    notification = {
      status: "error",
      title: "Error!",
      message: requestError,
    }
  }

  return (
    <section className={classes.contact}>
      <h1>How can I help you?</h1>
      <form className={classes.form} onSubmit={sendMessageHandler}>
        <div className={classes.controls}>
          <div className={classes.control}>
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email " required ref={enteredEmail} />
          </div>
          <div className={classes.control}>
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" required ref={enteredName} />
          </div>
        </div>
        <div className={classes.control}>
          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            rows={5}
            required
            ref={enteredMessage}
          ></textarea>
        </div>

        <div className={classes.actions}>
          <button>Send Message</button>
        </div>
      </form>
      {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          status={notification.status}
        />
      )}
    </section>
  )
}
