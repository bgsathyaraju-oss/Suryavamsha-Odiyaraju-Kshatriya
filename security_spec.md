# Security Specification - Suryavamsha Vadiyaraju Kshatriya Matrimony

## 1. Data Invariants
1. A profile cannot be modified by anyone other than its authenticated owner or a verified administrator.
2. Non-admin users cannot approve their own matrimonial profiles (`approvalStatus: 'approved'`, `isApproved: true`).
3. Private phone numbers and personal contact details are stored in `/users/{userId}/private/contact` and CANNOT be read publicly or listed. Only the owner or an admin can read it, or an authorized contact-request partner.
4. An interest record cannot be created with a spoofed `senderId` that differs from `request.auth.uid`.
5. Interests can only be accepted/declined by the `recipientId`, and withdrawn only by the `senderId`.
6. Consultation requests can only be created by the authenticated owner (`userId == request.auth.uid`), and status updates to 'accepted'/'contacted'/'completed' can only be performed by an Admin/Consultant.
7. Members cannot write or tamper with notifications intended for other users.
8. Unauthenticated users cannot write any documents.

## 2. The "Dirty Dozen" Payloads (Adversarial Attack Scenarios)
1. **Self-Approval Exploit**: Regular user attempts to update their profile with `{ "approvalStatus": "approved", "isApproved": true }`. (Must be REJECTED).
2. **Owner Spoofing on Profile Create**: Malicious user sends `{ "userId": "victim_uid_456", "fullName": "Victim Name" }`. (Must be REJECTED).
3. **Public Reading of Private Contacts**: Unauthenticated or unauthorized member attempts to fetch `/users/victim_123/private/contact`. (Must be REJECTED).
4. **Interest Spoofing**: Attacker sends interest with `senderId: "another_user_uid"`. (Must be REJECTED).
5. **Interest State Tampering**: Attacker tries to accept an interest sent to someone else (`request.auth.uid != recipientId`). (Must be REJECTED).
6. **Consultation Status Hijack**: Normal user updates consultation status from `pending` to `completed`. (Must be REJECTED).
7. **Cross-User Notification Injection**: Malicious user creates notification with `recipientId: "victim_123"` using an unverified account. (Must be REJECTED).
8. **Admin Privilege Escalation**: Normal user attempts to write to `/admins/{uid}` or update role to `admin`. (Must be REJECTED).
9. **Shortlist Deletion Hijack**: User A attempts to delete User B's shortlist document. (Must be REJECTED).
10. **Report Tampering**: Non-admin attempts to change report status to `dismissed`. (Must be REJECTED).
11. **Huge Payload / Denial of Wallet**: Payload with a 1MB string injected into `fullName` or `gotra`. (Must be REJECTED).
12. **Ghost Field Injection**: Adding `{ "isAdmin": true, "superUser": true }` to profile updates. (Must be REJECTED).

## 3. Test Runner Invariant
All 12 adversarial vectors are guaranteed to return `PERMISSION_DENIED` under the rules defined in `firestore.rules`.
