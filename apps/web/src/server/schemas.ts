import { z } from 'zod';

// ✅ Regex thay thế để kiểm tra URL repository
const repositoryRegex = /^(https?:\/\/)?(www\.)?[\w.-]+\/[\w-]+\/[\w-]+\/?$/i;

export const repositorySchema = z
  .string()
  .min(1, 'Repository is required')
  .trim()
  .toLowerCase()
  .regex(repositoryRegex, 'Please enter a valid repository URL');

// ✅ Tạo enum thay thế cho ReportType
enum ReportType {
  SPAM = 'SPAM',
  INAPPROPRIATE = 'INAPPROPRIATE',
  OTHER = 'OTHER',
}

// ✅ Schema Submit Tool
export const submitToolSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  websiteUrl: z
    .string()
    .min(1, 'Website is required')
    .url('Invalid URL')
    .trim(),
  repositoryUrl: repositorySchema,
  submitterName: z.string().min(1, 'Your name is required'),
  submitterEmail: z
    .string()
    .min(1, 'Your email is required')
    .email('Invalid email address, please use a correct format.'),
  submitterNote: z.string().max(200),
  newsletterOptIn: z.boolean().optional().default(true),
});

// ✅ Schema Newsletter
const SITE_URL = 'https://example.com';
const SITE_NAME = 'Example';

export const newsletterSchema = z.object({
  captcha: z.literal('').optional(),
  value: z.string().email('Please enter a valid email address'),
  referring_site: z.string().optional().default(SITE_URL),
  utm_source: z.string().optional().default(SITE_NAME),
  utm_medium: z.string().optional().default('subscribe_form'),
  utm_campaign: z.string().optional().default('organic'),
  double_opt_override: z.string().optional(),
  reactivate_existing: z.boolean().optional(),
  send_welcome_email: z.boolean().optional(),
});

// ✅ Schema Report
export const reportSchema = z.object({
  type: z.nativeEnum(ReportType),
  message: z.string().optional(),
});

// ✅ Export Type
export type SubmitToolSchema = z.infer<typeof submitToolSchema>;
export type NewsletterSchema = z.infer<typeof newsletterSchema>;
export type ReportSchema = z.infer<typeof reportSchema>;
