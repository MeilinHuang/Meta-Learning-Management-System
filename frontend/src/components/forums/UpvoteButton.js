
import React, { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { TiArrowUpOutline, TiArrowUpThick } from "react-icons/ti";

function UpvoteButton({ value, code, postId, isPostPage }) {
    const [ isLiked, setIsLiked ] = useState(false)
    const [ numOfLikes, setNumOfLikes ] = useState(value)
    const userId = Number(localStorage.getItem("id"))

    useEffect(() => {
        if (postId) {
            fetch(
                `http://localhost:8000/${code}/forum/post/like/${postId}`,
                {
                  method: "GET",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              ).then((r) => r.json()).then(data => {
                setNumOfLikes(data.num_of_upvotes)
                if (data.upvoters.includes(userId)) {
                    setIsLiked(true)
                }
            });
        }
    }, [code, postId, setIsLiked, userId])

    const handleLike = () => {
        fetch(
            `http://localhost:8000/${code}/forum/post/like/${postId}`,
            {
              method: "PUT",
              body: JSON.stringify({
                  userId
              }),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ).then((r) => {
            fetch(
                `http://localhost:8000/${code}/forum/post/like/${postId}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }).then((r) => r.json()).then(data => {
                setIsLiked(true)
                setNumOfLikes(data.num_of_upvotes)
            })
        })
    }

    const handleUnlike = () => {
        fetch(
            `http://localhost:8000/${code}/forum/post/unlike/${postId}`,
            {
              method: "PUT",
              body: JSON.stringify({
                  userId
              }),
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ).then((r) => {
            fetch(
                `http://localhost:8000/${code}/forum/post/like/${postId}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }).then((r) => r.json()).then(data => {
                setIsLiked(false)
                setNumOfLikes(data.num_of_upvotes)
            })
        })
    }

    return (
        <Button 
            leftIcon={isLiked ? <TiArrowUpThick /> : <TiArrowUpOutline />}
            variant={isLiked || isPostPage ? "solid" : "ghost"}
            onClick={isLiked ? handleUnlike : handleLike}
        >
                {numOfLikes}
        </Button>
    );
}

export default UpvoteButton;
