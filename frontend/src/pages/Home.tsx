import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import LogoutButton from "../components/LogoutButton";
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import "../styles/Home.css"

function Home() {
    const [posts, setPosts] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        getPosts(); // Get posts as soon as page renders
    }, []);

    const getPosts = () => { // Get all posts associated with user (all posts if staff)
        api
            .get("/posts/")
            .then((res) => res.data)
            .then((data) => { setPosts(data) })
            .catch((err) => console.log(err));
    };

    const deletePost = (id: number) => { // Delete a post
        api.delete(`/posts/${id}/`).then((res) => {
            if (res.status === 204) {
                console.log("Post deleted");
            } else {
                console.log("Failed to delete post");
            }
            getPosts();
        }).catch((err) => console.log(err));
    }

    const createPost = (e: React.FormEvent<HTMLFormElement>) => { // Create a post using data from form
        e.preventDefault();
        api.post("/posts/", {title: title, body: content, image: image, file: file}, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            if (res.status === 201) {
                console.log("Post created");
            } else {
                console.log("Failed to create post");
            }
            getPosts();
        }).catch((err) => console.log(err));
    }

    // return <div>
    //     <div className="button-container">
    //         <LogoutButton/>
    //     </div>
    //     <div className="form-posts-container">
    //         <div className="posts-container">
    //             <h3>Posts</h3>
    //             {posts.map((post) => (
    //                     <li key={post.id}>
    //                         <Link to="/details" state={{data: post}}>{post.title} - {post.author}</Link>
    //                         <button className="delete-button" onClick={() => deletePost(post.id)}>
    //                             Delete
    //                         </button>
    //                     </li>
    //             ))}
    //         </div>
    //         <div className="home-form-container">
    //             <h3>Create a Project</h3>
    //             <form onSubmit={createPost}>
    //                 <label htmlFor="title">Title:</label>
    //                 <br />
    //                 <input
    //                     type="text"
    //                     id="title"
    //                     name="title"
    //                     required
    //                     onChange={(e) => setTitle(e.target.value)}
    //                     value={title}
    //                 />
    //                 <label htmlFor="content">Content:</label>
    //                 <br />
    //                 <textarea
    //                     id="content"
    //                     name="content"
    //                     required
    //                     value={content}
    //                     onChange={(e) => setContent(e.target.value)}
    //                 ></textarea>
    //                 <label htmlFor="image">Image:</label>
    //                 <br />
    //                 <input
    //                     type="file"
    //                     id="image"
    //                     name="image"
    //                     accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
    //                     onChange={(e) => {
    //                         if (e.target.files && e.target.files[0]) {
    //                             setImage(e.target.files[0]);
    //                             setFile(null);
    //                             const fileInput = document.getElementById("file") as HTMLInputElement | null;;
    //                             if (fileInput) {
    //                                 fileInput.value = "";
    //                             }
    //                         } else {
    //                             setImage(null);
    //                         }
    //                     }}
    //                 />
    //                 <label htmlFor="file">File:</label>
    //                 <br />
    //                 <input
    //                     type="file"
    //                     id="file"
    //                     name="file"
    //                     accept="application/pdf, text/plain, text/rtf"
    //                     onChange={(e) => {
    //                         if (e.target.files && e.target.files[0]) {
    //                             setFile(e.target.files[0]);
    //                             setImage(null);
    //                             const imageInput = document.getElementById("image") as HTMLInputElement | null;
    //                             if (imageInput) {
    //                                 imageInput.value = "";
    //                             }
    //                         } else {
    //                             setFile(null);
    //                         }
    //                     }}
    //                 />
    //                 <input type="submit" value="Submit"></input>
    //             </form>
    //         </div>
    //     </div>
    // </div>;

    return <div>
        <div className="button-container">
            <LogoutButton/>
        </div>
        <div className="form-posts-container">
            <div className="posts-container">
                <ListGroup variant="flush">
                    <h1>Posts</h1>
                    {posts.map((post) => (  
                            <ListGroup.Item key={post.id} className="list-group-item">
                                {/* <Button variant="outline-danger" size="sm" className="delete-button rounded-circle" onClick={() => deletePost(post.id)}>
                                    X
                                </Button> */}
                                <CloseButton variant="white" onClick={() => deletePost(post.id)} className="delete-button"/>
                                <Link to="/details" state={{data: post}} className="link-item"><b>{post.title}:</b> {post.body.slice(0, 50)}{post.body.length > 50 && '...'}</Link>
                            </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
            <div className="home-form-container">
                <Form onSubmit={createPost} className="form-container-wide">
                    <h3>Create a Post</h3>
                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={5} onChange={(e) => setContent(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formImage" className="mb-3">
                        <Form.Label>Image (max size: 100MB)</Form.Label>
                        <Form.Control 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
                            onChange={(e) => {
                                const fileInput = e.target as HTMLInputElement;
                                if (fileInput.files && fileInput.files[0]) {
                                    setImage(fileInput.files[0]);
                                    setFile(null);
                                } else {
                                    setImage(null);
                                }
                            }}
                            disabled={!!file}
                        />
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>or Text/Video File (max size: 1GB)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="application/pdf, text/plain, text/rtf, video/mp4, video/mov"
                            onChange={(e) => {
                                const fileInput = e.target as HTMLInputElement;
                                if (fileInput.files && fileInput.files[0]) {
                                    setFile(fileInput.files[0]);
                                    setImage(null);
                                } else {
                                    setFile(null);
                                }
                            }}
                            disabled={!!image}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    </div>;
}

export default Home;