import { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";

const STORAGE_KEYS = {
  users: "dmun_users",
  messages: "dmun_messages",
  currentUser: "dmun_current_user",
};

const SEED_USERS = [
  {
    name: "Jaewon Choi",
    email: "jaewon.choi@dmun.org",
    role: "lead",
    title: "Founder & Executive Director",
  },
  {
    name: "Harshan M V",
    email: "harshan.mv@dmun.org",
    role: "co-lead",
    title: "Deputy Executive Director",
  },
  {
    name: "Ishaan Bajaj",
    email: "ishaan.bajaj@dmun.org",
    role: "user",
    title: "Programs Associate",
  },
  {
    name: "Sample Person",
    email: "sample.person@dmun.org",
    role: "user",
    title: "Sample Role",
  },
];

const ROLE_META = {
  lead: { label: "Lead", color: "#d4af37" },
  "co-lead": { label: "Co-Lead", color: "#b0b7c3" },
  user: { label: "Staff", color: "#44b8f3" },
};

function ensureSeedData() {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.messages)) {
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify([]));
  }
}

const PageWrapper = styled.div`
  background: var(--andover-light-blue);
  min-height: 100vh;
  padding: clamp(3.5rem, 6vw, 6rem) clamp(1.5rem, 6vw, 6rem);
  box-sizing: border-box;
  color: var(--andover-dark-blue);
  font-family: var(--andover-font-sans);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const LoginCard = styled.div`
  max-width: 460px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.92);
  padding: clamp(2rem, 4vw, 2.8rem);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(0, 33, 71, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Heading = styled.h1`
  font-family: var(--andover-font-serif);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: clamp(2rem, 3.4vw, 2.6rem);
  margin: 0;
`;

const SubHeading = styled.p`
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
  opacity: 0.8;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(0, 33, 71, 0.2);
  font-size: 1rem;
  font-family: var(--andover-font-sans);
  &:focus {
    outline: none;
    border-color: var(--andover-blue);
    box-shadow: 0 0 0 4px rgba(68, 184, 243, 0.2);
  }
`;

const Button = styled.button`
  border: none;
  background: ${({ variant }) =>
    variant === "secondary" ? "rgba(0, 33, 71, 0.08)" : "var(--andover-blue)"};
  color: ${({ variant }) =>
    variant === "secondary" ? "var(--andover-dark-blue)" : "#002147"};
  font-family: var(--andover-font-serif);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0.85rem 1.6rem;
  border-radius: 18px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0, 33, 71, 0.18);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #a11229;
  background: rgba(161, 18, 41, 0.1);
  border: 1px solid rgba(161, 18, 41, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 12px;
`;

const DashboardLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  gap: clamp(1.5rem, 3vw, 2.5rem);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(0, 33, 71, 0.1);
  padding: clamp(1.6rem, 3vw, 2.2rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.4rem);
`;

const PanelHeading = styled.h2`
  margin: 0;
  font-family: var(--andover-font-serif);
  text-transform: uppercase;
  font-size: 1.2rem;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Badge = styled.span`
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: ${({ color }) => color || "rgba(0, 33, 71, 0.1)"};
  color: ${({ color }) =>
    color && color !== "rgba(0, 33, 71, 0.1)" ? "#002147" : "inherit"};
  font-size: 0.78rem;
  font-family: var(--andover-font-serif);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const UserHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const UserName = styled.span`
  font-family: var(--andover-font-serif);
  font-size: 1.4rem;
  letter-spacing: 0.05em;
`;

const UserTitle = styled.span`
  font-size: 0.95rem;
  opacity: 0.75;
`;

const SectionDivider = styled.hr`
  border: none;
  height: 1px;
  background: rgba(0, 33, 71, 0.08);
`;

const Form = styled.form`
  display: grid;
  gap: 0.9rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Label = styled.label`
  font-family: var(--andover-font-serif);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(0, 33, 71, 0.2);
  font-size: 1rem;
  font-family: var(--andover-font-sans);
  background: #fff;
  &:focus {
    outline: none;
    border-color: var(--andover-blue);
    box-shadow: 0 0 0 4px rgba(68, 184, 243, 0.2);
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(0, 33, 71, 0.04);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageCard = styled.div`
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.2rem 1.4rem;
  box-shadow: 0 12px 26px rgba(0, 33, 71, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
`;

const MessageAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--andover-font-serif);
  font-size: 1rem;
`;

const MessageTime = styled.span`
  font-size: 0.78rem;
  opacity: 0.7;
`;

const MessageBody = styled.p`
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const ResponseActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: clamp(1.5rem, 4vw, 3rem);
  background: ${({ tone }) =>
    tone === "error" ? "rgba(161,18,41,0.9)" : "rgba(68,184,243,0.9)"};
  color: ${({ tone }) => (tone === "error" ? "#fff" : "#002147")};
  padding: 0.9rem 1.3rem;
  border-radius: 16px;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  box-shadow: 0 18px 38px rgba(0, 33, 71, 0.25);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ConfirmationText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
`;

function ExecutivesPortal() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ensureSeedData();
    const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.users));
    const storedMessages = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.messages)
    );
    const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.currentUser);

    setUsers(storedUsers || []);
    setMessages(storedMessages || []);
    if (storedCurrentUser) {
      // validate stored user still exists
      const parsed = JSON.parse(storedCurrentUser);
      if (storedUsers?.some((user) => user.email === parsed.email)) {
        setCurrentUser(parsed);
      } else {
        localStorage.removeItem(STORAGE_KEYS.currentUser);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, [users, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
  }, [messages, loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (currentUser) {
      localStorage.setItem(
        STORAGE_KEYS.currentUser,
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.currentUser);
    }
  }, [currentUser, loaded]);

  const showToast = useCallback((text, tone = "success") => {
    setToast({ text, tone });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const handleLogin = useCallback(
    (event) => {
      event.preventDefault();
      setError("");
      const trimmed = emailInput.trim().toLowerCase();

      if (!trimmed.endsWith("@dmun.org")) {
        setError("Only @dmun.org email addresses are permitted.");
        return;
      }

      const user = users.find((item) => item.email.toLowerCase() === trimmed);
      if (!user) {
        setError(
          "We could not find that account. Please contact the Lead for access."
        );
        return;
      }

      setCurrentUser(user);
      setEmailInput("");
      showToast(`Welcome back, ${user.name.split(" ")[0]}!`, "success");
    },
    [emailInput, users, showToast]
  );

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    showToast("You have been logged out.", "success");
  }, [showToast]);

  const currentCoLead = useMemo(
    () => users.find((user) => user.role === "co-lead"),
    [users]
  );

  const assignCoLead = useCallback(
    (email) => {
      const target = users.find((user) => user.email === email);
      if (!target) return;
      if (
        !window.confirm(
          `Assign ${target.name} as Co-Lead? This will replace the current Co-Lead.`
        )
      ) {
        return;
      }
      const updated = users.map((user) => {
        if (user.role === "co-lead") {
          return { ...user, role: "user" };
        }
        if (user.email === email) {
          return { ...user, role: "co-lead" };
        }
        return user;
      });
      setUsers(updated);
      showToast(`${target.name} is now the Co-Lead.`);
    },
    [users, showToast]
  );

  const revokeCoLead = useCallback(() => {
    if (!currentCoLead) return;
    if (
      !window.confirm(`Revoke Co-Lead privileges from ${currentCoLead.name}?`)
    ) {
      return;
    }
    const updated = users.map((user) =>
      user.role === "co-lead" ? { ...user, role: "user" } : user
    );
    setUsers(updated);
    showToast("Co-Lead privileges revoked.");
  }, [currentCoLead, users, showToast]);

  const handleAddUser = useCallback(
    (event) => {
      event.preventDefault();
      const form = event.target;
      const data = new FormData(form);
      const name = data.get("name").trim();
      const email = data.get("email").trim().toLowerCase();
      const role = data.get("role");
      const title = data.get("title").trim();

      if (!name || !email || !title) {
        showToast("All fields are required.", "error");
        return;
      }

      if (!email.endsWith("@dmun.org")) {
        showToast("User email must end with @dmun.org.", "error");
        return;
      }

      if (users.some((user) => user.email.toLowerCase() === email)) {
        showToast("This email already has access.", "error");
        return;
      }

      if (role === "lead") {
        showToast("Only one Lead is permitted.", "error");
        return;
      }

      if (role === "co-lead" && currentCoLead) {
        showToast(
          "Please revoke the current Co-Lead before assigning another.",
          "error"
        );
        return;
      }

      const newUser = { name, email, role, title };
      setUsers([...users, newUser]);
      form.reset();
      showToast(`${name} was added to the portal.`);
    },
    [users, currentCoLead, showToast]
  );

  const handleSendMessage = useCallback(
    (event) => {
      event.preventDefault();
      const form = event.target;
      const message = form.elements["message"].value.trim();
      if (!message) {
        showToast("Message cannot be empty.", "error");
        return;
      }
      const newMessage = {
        id: `${Date.now()}`,
        content: message,
        timestamp: new Date().toISOString(),
        sender: {
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        },
        responses: {},
      };
      setMessages([newMessage, ...messages]);
      form.reset();
      showToast("Message broadcast sent.");
    },
    [currentUser, messages, showToast]
  );

  const handleRespond = useCallback(
    (messageId, response) => {
      const updated = messages.map((msg) => {
        if (msg.id !== messageId) return msg;
        return {
          ...msg,
          responses: {
            ...msg.responses,
            [currentUser.email]: response,
          },
        };
      });
      setMessages(updated);
      showToast("Response recorded.");
    },
    [messages, currentUser, showToast]
  );

  const responseSummary = useCallback((message) => {
    const counts = { yes: 0, no: 0, maybe: 0 };
    Object.values(message.responses || {}).forEach((value) => {
      if (counts[value] !== undefined) {
        counts[value] += 1;
      }
    });
    return counts;
  }, []);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    [messages]
  );

  return (
    <PageWrapper>
      {!currentUser ? (
        <LoginCard>
          <Heading>Executives Portal</Heading>
          <SubHeading>
            Signed-in access for DMUN leadership and associates. Use your
            @dmun.org email to enter the secure dashboard.
          </SubHeading>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Label htmlFor="email">DMUN Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@dmun.org"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                required
              />
            </FieldGroup>
            <Button type="submit">Access Portal</Button>
          </form>
          {error && <ErrorText>{error}</ErrorText>}
          <ConfirmationText>
            Only registered executives may sign in. Contact the Lead if you
            believe you should have access.
          </ConfirmationText>
        </LoginCard>
      ) : (
        <>
          <DashboardLayout>
            <Panel>
              <UserHeader>
                <Badge color={ROLE_META[currentUser.role]?.color}>
                  {ROLE_META[currentUser.role]?.label || currentUser.role}
                </Badge>
                <UserName>{currentUser.name}</UserName>
                <UserTitle>{currentUser.title}</UserTitle>
              </UserHeader>
              <Button type="button" variant="secondary" onClick={handleLogout}>
                Log Out
              </Button>
              <SectionDivider />
              <ConfirmationText>
                Need help? Contact the Lead to request additional permissions or
                update your profile.
              </ConfirmationText>
            </Panel>

            <Panel>
              <PanelHeading>Broadcast Feed</PanelHeading>
              {(currentUser.role === "lead" ||
                currentUser.role === "co-lead") && (
                <Form onSubmit={handleSendMessage}>
                  <FieldGroup>
                    <Label htmlFor="message">Send Update</Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      style={{
                        borderRadius: "16px",
                        border: "1px solid rgba(0,33,71,0.2)",
                        padding: "0.85rem 1rem",
                        fontFamily: "var(--andover-font-sans)",
                        fontSize: "0.95rem",
                        resize: "vertical",
                      }}
                      placeholder="Share agenda updates, deadlines, or alerts…"
                    />
                  </FieldGroup>
                  <Button type="submit">Broadcast to Team</Button>
                </Form>
              )}
              <MessageList>
                {sortedMessages.length === 0 ? (
                  <ConfirmationText>
                    No messages yet. Start the conversation above.
                  </ConfirmationText>
                ) : (
                  sortedMessages.map((message) => {
                    const meta = ROLE_META[message.sender.role] || {};
                    const summary = responseSummary(message);
                    const userResponse = message.responses[currentUser.email];
                    return (
                      <MessageCard key={message.id}>
                        <MessageHeader>
                          <MessageAuthor>
                            <Badge color={meta.color}>
                              {meta.label || message.sender.role}
                            </Badge>
                            {message.sender.name}
                          </MessageAuthor>
                          <MessageTime>
                            {new Date(message.timestamp).toLocaleString()}
                          </MessageTime>
                        </MessageHeader>
                        <MessageBody>{message.content}</MessageBody>
                        {(currentUser.role === "lead" ||
                          currentUser.role === "co-lead") && (
                          <ConfirmationText>
                            Responses — Yes: {summary.yes} · No: {summary.no} ·
                            Maybe: {summary.maybe}
                          </ConfirmationText>
                        )}
                        {currentUser.role === "user" && (
                          <ResponseActions>
                            {["yes", "no", "maybe"].map((option) => (
                              <Button
                                key={option}
                                type="button"
                                variant={
                                  userResponse === option
                                    ? "primary"
                                    : "secondary"
                                }
                                onClick={() =>
                                  handleRespond(message.id, option)
                                }
                              >
                                {option.toUpperCase()}
                              </Button>
                            ))}
                          </ResponseActions>
                        )}
                      </MessageCard>
                    );
                  })
                )}
              </MessageList>
            </Panel>
          </DashboardLayout>

          {currentUser.role === "lead" && (
            <DashboardLayout>
              <Panel>
                <PanelHeading>Team Directory</PanelHeading>
                <UserList>
                  {users
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((user) => (
                      <UserRow key={user.email}>
                        <UserInfo>
                          <strong>{user.name}</strong>
                          <span>{user.title}</span>
                          <span style={{ opacity: 0.7, fontSize: "0.85rem" }}>
                            {user.email}
                          </span>
                        </UserInfo>
                        <Badge color={ROLE_META[user.role]?.color}>
                          {ROLE_META[user.role]?.label || user.role}
                        </Badge>
                        {user.role !== "lead" && (
                          <Button
                            type="button"
                            onClick={() =>
                              user.role === "co-lead"
                                ? revokeCoLead()
                                : assignCoLead(user.email)
                            }
                          >
                            {user.role === "co-lead"
                              ? "Revoke Co-Lead"
                              : "Assign Co-Lead"}
                          </Button>
                        )}
                      </UserRow>
                    ))}
                </UserList>
              </Panel>

              <Panel>
                <PanelHeading>Add Team Member</PanelHeading>
                <Form onSubmit={handleAddUser}>
                  <FieldGroup>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Full name"
                      required
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@dmun.org"
                      required
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Role / Title"
                      required
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label htmlFor="role">Role</Label>
                    <Select id="role" name="role" defaultValue="user">
                      <option value="user">General User</option>
                      <option value="co-lead">Co-Lead</option>
                    </Select>
                  </FieldGroup>
                  <Button type="submit">Add Member</Button>
                </Form>
                <ConfirmationText>
                  Co-Lead appointments replace the current Co-Lead. Leads cannot
                  be reassigned through this interface.
                </ConfirmationText>
              </Panel>
            </DashboardLayout>
          )}
        </>
      )}
      {toast && <Toast tone={toast.tone}>{toast.text}</Toast>}
    </PageWrapper>
  );
}

export default ExecutivesPortal;
