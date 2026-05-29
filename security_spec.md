# Security Spec: Gemini Chat and Mirror Files

## 1. Data Invariants
- **Owner Lock**: A file or a chat document can never be created or read by anyone except the authenticated user who owns it. The `userId` must strictly match `request.auth.uid`.
- **Relational Integrity**: A subresource (like a file or a chat) must always be bound to the specific parent user's path, and matching variables must confirm authorship.
- **Timestamp Accuracy**: Immutability on `createdAt` and mandatory enforcement of `request.time` on `updatedAt` prevent back-dating or replay attacks.
- **Input Boundaries**: File names must not exceed 255 characters, and file content must be checked to prevent standard Buffer Attacks.

## 2. The "Dirty Dozen" Payloads (Exploitations to Block)
1. **Identity Theft (File creation with spoofed owner)**: `data.userId = "user_b"` in `users/user_a/files/file_1` where auth is `user_a`.
2. **PII Data Leak (Reading files list of another user)**: Get on `users/user_b/files` where auth is `user_a`.
3. **Privilege Escalation (Modifying file ownership)**: Update `userId` from `"user_a"` to `"user_c"` to kidnap a document.
4. **Temporal Manipulation (Spoofing timestamps)**: Sending a hardcoded client time e.g., `"2020-01-01"` instead of `request.time`.
5. **Denial of Wallet (Huge file name size)**: Creating a file with a 10MB filename.
6. **Bypassing Schemas (Inserting ghost fields)**: Injecting a `ghostVerifier: "admin"` field to bypass checks.
7. **Resource Poisoning (Empty file keys)**: Creating a file without required `name` or `mimeType`.
8. **Malicious ID Injection**: Creating a file with ID containing special escape characters like `../` to pollute document paths.
9. **Chat Theft (Accessing chat threads of other users)**: Reading or updating chat logs under `users/user_b/chats/chat_1`.
10. **Chat Manipulation**: Substituting message history array with arbitrary systems prompts or hacking the sender role.
11. **System Field Overwrite**: Intercepting and trying to update system-locked metadata fields of files.
12. **Double-Read Abuse**: Sending bulk nested queries to exhaust read quotas without matching user constraints.

## 3. The Test Cases Matrix
Our Firestore security rules (`firestore.rules`) will be strictly configured using custom validation helpers to reject all of the above payloads. All read and write queries must explicitly verify resource owners to prevent un-scoped listings.
