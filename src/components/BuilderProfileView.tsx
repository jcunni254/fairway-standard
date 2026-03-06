"use client";

import { Content } from "@builder.io/sdk-react";
import type { BuilderContent } from "@builder.io/sdk-react";

export interface BuilderProfileData {
  profile: {
    displayName: string;
    locationLine: string | null;
    avatarUrl: string | null;
    clerkInitials: string;
    bio: string | null;
    yearsExperience: number | null;
    roleLabel: string;
    verified: boolean;
    subscriptionStatus: string | null;
    isCaddie: boolean;
    phone: string | null;
    email: string | null;
  };
  reviews: Array<{
    id: string;
    reviewer_name: string;
    rating: number;
    comment: string | null;
    created_at: string;
  }>;
  reviewCount: number;
  averageRating: number | null;
  userId: string;
}

interface Props {
  content: BuilderContent | null;
  apiKey: string;
  data: BuilderProfileData;
}

export default function BuilderProfileView({ content, apiKey, data }: Props) {
  if (!content) return null;

  return (
    <Content
      content={content}
      model="page"
      apiKey={apiKey}
      data={data}
    />
  );
}
