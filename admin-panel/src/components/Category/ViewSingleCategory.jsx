import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import "./AddCategory.css";
import RemoveIcon from "@mui/icons-material/Remove";
import "./ViewSingleCategory.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "../RepeatableComponents/Navigation";
import BigLoader from "../Loader/BigLoader";
const ViewSingleCategory = () => {
  const { id } = useParams();
  const [category_type, setCategoryName] = useState("");
  const [sections, setSections] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    const getCategoryData = async () => {
      try {
        setLoading(true);
        await axios
          .get(`http://localhost:5000/category/get-category/${id}`)
          .then((response) => {
            setLoading(false);
            setCategoryName(response.data.category_type);
            setSections(response.data.sections);
            setAttributes(response.data.attributes);
            console.log(response.data);
          });
      } catch (err) {
        setLoading(false);
        alert(err);
      }
    };
    getCategoryData();
  }, []);
  return (
    <div className="view-single-category-container">
      <Navigation />
      {Loading ? (
        <BigLoader />
      ) : (
        <div>
          <h1>View Category details</h1>
          <div className="category-form">
            <TextField
              id="outlined-search"
              label="Category name"
              type="text"
              value={category_type}
              InputProps={{
                readOnly: true,
              }}
            />
            <br />
            <br />
            <h2>Attributes</h2>
            {attributes.map((attribute, attributeIndex) => (
              <div key={attribute.id} className="attribute">
                <TextField
                  type="text"
                  label="Attribute Heading"
                  size="small"
                  defaultValue={attribute.attributeHeading}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                {attribute.options.map((option, optionIndex) => (
                  <div key={option.id} className="option">
                    <TextField
                      type="text"
                      label="Option Heading"
                      defaultValue={option.optionHeading}
                      size="small"
                      sx={{ mt: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      type="text"
                      label="Option Type"
                      defaultValue={option.optionType}
                      size="small"
                      sx={{ mt: 2, ml: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      type="text"
                      label="Option Description"
                      defaultValue={option.optionDescription}
                      size="small"
                      sx={{ mt: 2, ml: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                ))}
                <br />

                <br />
              </div>
            ))}

            <br />
            <br />
            <hr />
            <h2>Sections</h2>
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="section">
                <TextField
                  id="outlined-search"
                  label="Page No"
                  type="number"
                  size="small"
                  defaultValue={section.pageNo}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="outlined-search"
                  label="Page Heading"
                  type="text"
                  size="small"
                  defaultValue={section.pageHeading}
                  sx={{ ml: 2 }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="outlined-search"
                  label="Page Description"
                  size="small"
                  type="text"
                  defaultValue={section.pageDescription}
                  sx={{ ml: 2 }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <br />
                <br />

                {section.options.map((option, optionIndex) => (
                  <div key={option.id} className="option">
                    <TextField
                      id="outlined-search"
                      label="Option Heading"
                      type="search"
                      size="small"
                      defaultValue={option.optionHeading}
                      sx={{ mb: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      id="outlined-search"
                      label="Option Type"
                      type="search"
                      size="small"
                      defaultValue={option.optionType}
                      sx={{ ml: 2, mb: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      id="outlined-search"
                      label="Option Description"
                      type="search"
                      size="small"
                      defaultValue={option.optionDescription}
                      sx={{ ml: 2, mb: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                ))}

                <br />
                <br />
              </div>
            ))}
            <br />
            <br />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSingleCategory;
