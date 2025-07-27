// These are the security rules for Firebase Storage
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Rule for user avatars.
    // This rule says: a file can only be written in the 'avatars/{userId}' path
    // if the person uploading it is logged in (request.auth != null)
    // AND their user ID matches the {userId} in the path.
    // This prevents a user from overwriting another user's avatar.
    match /avatars/{userId}/{fileName} {
      allow read; // Anyone can read profile pictures
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
  }
}