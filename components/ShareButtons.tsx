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
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const handleInstagramShare = () => {
    const instagramUrl = `https://www.instagram.com/create/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(instagramUrl, '_blank');
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <FacebookShareButton url={url} style={{ cursor: "pointer" }}>
        <SocialIcon network="facebook" style={{ height: 35, width: 35 }} />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title} style={{ cursor: "pointer" }}>
        <SocialIcon network="twitter" style={{ height: 35, width: 35 }} />
      </TwitterShareButton>
      <WhatsappShareButton
        url={url}
        title={title}
        style={{ cursor: "pointer" }}
      >
        <SocialIcon network="whatsapp" style={{ height: 35, width: 35 }} />
      </WhatsappShareButton>
      <LinkedinShareButton url={url} style={{ cursor: "pointer" }}>
        <SocialIcon network="linkedin" style={{ height: 35, width: 35 }} />
      </LinkedinShareButton>
      <button onClick={handleInstagramShare}>
        <SocialIcon network="instagram" />
      </button>
    </div>
  );
};

export default ShareButtons;
