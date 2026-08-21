# Talent Video Storage Research

## Official Supabase constraints

Supabase documents that Free projects can set a global file upload limit no higher than **50 MB**. Bucket-specific limits must be no higher than that global limit. Standard uploads can technically transfer files up to 5 GB, but Supabase recommends resumable uploads for files over 6 MB. The existing PWLIF private media bucket is restricted to images and a 4 MB bucket limit, so it must be deliberately reconfigured before any persistent Talent video upload can be enabled.

For the PWLIF limited launch, use a conservative **50 MB** maximum file size and accept only `video/mp4` and `video/webm`, subject to the Foundation project’s Supabase global setting permitting this limit. Keep the bucket private; only protected server routes may upload or deliver video bytes.

## Sources

1. [Supabase Storage file limits](https://supabase.com/docs/guides/storage/uploads/file-limits)
2. [Supabase upload file size restrictions](https://supabase.com/docs/guides/troubleshooting/upload-file-size-restrictions-Y4wQLT)
3. [Supabase JavaScript updateBucket reference](https://supabase.com/docs/reference/javascript/file-buckets-updatebucket)
