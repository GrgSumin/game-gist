import React, { useState, FormEvent } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Input,
  SelectChangeEvent,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreatePlayer.css"; // Import CSS

const CreatePlayer: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [club, setClub] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [position, setPosition] = useState<string>("FWD");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("club", club);
    formData.append("price", price.toString());
    formData.append("position", position);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(
        "http://localhost:4001/api/footballplayers/create",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      toast.success("Player created successfully!");
      console.log(data);
    } catch (error) {
      toast.error("Error creating player.");
      console.error("Error creating player:", error);
    }
  };

  const handlePositionChange = (e: SelectChangeEvent<string>) => {
    setPosition(e.target.value as string);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <TextField
          className="input-field"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <TextField
          className="input-field"
          fullWidth
          value={club}
          onChange={(e) => setClub(e.target.value)}
          placeholder="Club"
          required
        />
        <TextField
          className="input-field"
          fullWidth
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price"
          required
        />
        <Select
          className="input-field"
          fullWidth
          value={position}
          onChange={handlePositionChange}
        >
          <MenuItem value="GK">Goalkeeper</MenuItem>
          <MenuItem value="DEF">Defender</MenuItem>
          <MenuItem value="MID">Midfielder</MenuItem>
          <MenuItem value="FWD">Forward</MenuItem>
        </Select>
        <Input
          className="input-field"
          type="file"
          onChange={handleFileChange}
        />
        <Button type="submit" variant="contained">
          Create Player
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreatePlayer;
