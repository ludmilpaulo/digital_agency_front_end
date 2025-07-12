"use client";
import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";
import { SocialIcon } from "react-social-icons";

interface ShareButtonsProps {
  url: string;
  title: string;
  excerpt?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, excerpt }) => {
  const shareText = `${title} – ${excerpt ?? ""}`.slice(0, 280);

  const handleInstagramShare = () => {
    // Instagram does not support direct web sharing of content
    // Instead, open your agency profile for brand engagement
    window.open("https://www.instagram.com/maindodigital/", "_blank");
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <FacebookShareButton url={url}>
        <SocialIcon network="facebook" style={{ height: 35, width: 35 }} />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={shareText}>
        <SocialIcon network="twitter" style={{ height: 35, width: 35 }} />
      </TwitterShareButton>
      <WhatsappShareButton url={url} title={shareText}>
        <SocialIcon network="whatsapp" style={{ height: 35, width: 35 }} />
      </WhatsappShareButton>
      <LinkedinShareButton url={url} title={title}>
        <SocialIcon network="linkedin" style={{ height: 35, width: 35 }} />
      </LinkedinShareButton>
      <button
        type="button"
        onClick={handleInstagramShare}
        style={{ background: "none", border: "none", cursor: "pointer" }}
        aria-label="Share on Instagram"
      >
        <SocialIcon network="instagram" style={{ height: 35, width: 35 }} />
      </button>
    </div>
  );
};

export default ShareButtons;
