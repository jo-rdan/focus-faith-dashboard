import React, { useEffect, useRef, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import verifyToken from "../../helpers/verifyToken";
import JoditEditor from "jodit-react";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import {
  Grid,
  TextField,
  Container,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import Axios from "axios";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import video from "../../assets/videos/A Pass (Didadada).mp4";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    top: "50px",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  text: {
    marginLeft: "10px",
  },
  editor: {
    overflowY: "scroll",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const VideoComponent = (props) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  // const [modalStyle] = React.useState(getModalStyle);
  const editor = useRef(null);
  const [content, setContent] = React.useState("");

  const config = {
    // all options from https://xdsoft.net/jodit/doc/
    askBeforePasteHTML: false,
    askBeforePasteFromWord: true, //couse styling issues when pasting from word
    events: {
      afterOpenPasteDialog: (dialog, msg, title, callback) => {
        dialog.close();
        callback();
      },
    },
  };
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
  });
  const [article, setArticle] = React.useState({
    title: null,
    subtitle: null,
    body: null,
    author: null,
    category: null,
    image: null,
    bodyHtml: null,
  });
  const [toast, setToast] = React.useState({
    message: "",
    open: false,
    type: "",
  });
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const { payload } = verifyToken(token);
    setUser({ firstName: payload.firstname, lastName: payload.lastname });
  }, []);

  const handleChange = (event) => {
    setArticle({ ...article, category: event.target.value });
  };

  const handleNewArticle = async () => {
    try {
      const results = await Axios.post(
        "http://localhost:3000/api/new-article",
        {
          title: article.title,
          subtitle: article.subtitle,
          body: content,
          author: `${user.firstName} ${user.lastName}`,
          category: article.category,
          image: article.image,
          bodyhtml: article.bodyHtml,
        }
      );
      setToast({
        message: "Article submitted successfully to the editor!",
        open: true,
        type: "success",
      });
      window.location.reload();
    } catch (error) {
      setToast({ message: error.message, open: true, type: "error" });
    }
  };

  const handleImageUpload = async () => {
    setLoading(true);
    const { files } = document.querySelector('input[type="file"]');
    const formData = new FormData();
    formData.append("file", files[0]);
    // replace this with your upload preset name
    formData.append("upload_preset", "focus_faith");
    const options = {
      method: "POST",
      body: formData,
    };

    // replace cloudname with your Cloudinary cloud_name
    const results = await fetch(
      "https://api.Cloudinary.com/v1_1/focus-faith-family/image/upload",
      options
    );
    const response = await results.json();
    setLoading(false);
    console.log("uploaded!!!");
    setArticle({ ...article, image: response.secure_url });
  };

  const handleBody = (event) => {
    console.log("eeent", event);
    setArticle({ ...article, bodyHtml: event });
  };
  const handleText = (event) => {
    setArticle({ ...article, title: event.target.value });
  };
  const handleSub = (event) => {
    setArticle({ ...article, subtitle: event.target.value });
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ position: "absolute", top: "50px", border: "none" }}
      >
        <Container maxWidth="md">
          <Grid
            style={{
              backgroundColor: "white",
              // paddingRight: "50px",
            }}
            container
            justify="center"
          >
            <video width="520" height="340" controls>
              <source src={video} type="video/mp4"></source>
            </video>
          </Grid>
        </Container>
      </Modal>
    </div>
  );
};

export default VideoComponent;
