import React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import "./AddCategory.css";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EditCategory.css";
import Navigation from "../RepeatableComponents/Navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BigLoader from "../Loader/BigLoader";

const EditCategory = () => {
  const { id } = useParams();
  const [category_type, setCategoryName] = useState("");
  const [sections, setSections] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const getCategoryData = async () => {
    try {
      setLoading(true);
      await axios
        .get(`http://api.selligo.in/category/get-category/${id}`)
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

  useEffect(() => {
    getCategoryData();
  }, []);

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        pageNo: "",
        pageHeading: "",
        pageDescription: "",
        options: [],
      },
    ]);
  };

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { id: Date.now(), attributeHeading: "", options: [] },
    ]);
  };

  const handleInputChange = (sectionIndex, field, value, optionIndex) => {
    const updatedSections = [...sections];
    const sectionToUpdate = { ...updatedSections[sectionIndex] };

    if (field.includes("options.")) {
      const [optionsField, dynamicIndex, nestedField] = field.split(".");
      sectionToUpdate.options[dynamicIndex] = {
        ...sectionToUpdate.options[dynamicIndex],
        [nestedField]: value,
      };
    } else {
      sectionToUpdate[field] = value;
    }

    updatedSections[sectionIndex] = sectionToUpdate;
    setSections(updatedSections);
  };

  const addOption = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].options.push({
      id: Date.now(),
      optionHeading: "",
      optionType: "",
      optionDescription: "",
      optionValue: "",
    });
    setSections(updatedSections);
  };

  // Remove an option from a section
  const removeOption = (sectionIndex, optionId) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].options = updatedSections[
      sectionIndex
    ].options.filter((option) => option.id !== optionId);
    setSections(updatedSections);
  };

  const removeSection = (id) => {
    setSections((prevSections) => {
      return prevSections.filter((section) => section.id !== id);
    });
  };

  const handleAttributeChange = (attributeIndex, field, value, optionIndex) => {
    const updatedAttributes = [...attributes];
    const attributeToUpdate = { ...updatedAttributes[attributeIndex] };

    if (field.includes("options.")) {
      const [optionsField, dynamicIndex, nestedField] = field.split(".");
      attributeToUpdate.options[dynamicIndex] = {
        ...attributeToUpdate.options[dynamicIndex],
        [nestedField]: value,
      };
    } else {
      attributeToUpdate[field] = value;
    }

    updatedAttributes[attributeIndex] = attributeToUpdate;
    setAttributes(updatedAttributes);
  };
  const addAttributeOption = (attributeIndex) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[attributeIndex].options.push({
      id: Date.now(),
      optionHeading: "",
      optionType: "",
      optionDescription: "",
      optionValue: "",
    });
    setAttributes(updatedAttributes);
  };

  // Remove an option from an attribute
  const removeAttributeOption = (attributeIndex, optionIndex) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[attributeIndex].options = updatedAttributes[
      attributeIndex
    ].options.filter((_, i) => i !== optionIndex);
    setAttributes(updatedAttributes);
  };

  // Remove an attribute
  const removeAttribute = (attributeIndex) => {
    const updatedAttributes = attributes.filter((_, i) => i !== attributeIndex);
    setAttributes(updatedAttributes);
  };

  const submitData = async () => {
    try {
      if (
        attributes.length === 0 ||
        attributes.every((attr) => attr.options.length === 0)
      ) {
        toast.warning("Please add at least one attribute with one option.");
        return;
      }

      // Validate at least one section with one option
      if (
        sections.length === 0 ||
        sections.every((sec) => sec.options.length === 0)
      ) {
        toast.warning("Please add at least one section with one option.");
        return;
      }

      if (
        attributes.some((attr) =>
          attr.options.some((opt) => !opt.optionHeading || !opt.optionType)
        ) ||
        sections.some((sec) =>
          sec.options.some((opt) => !opt.optionHeading || !opt.optionType)
        )
      ) {
        toast.warning(
          "Please fill in both Option Heading and Option Type for every option."
        );
        return;
      }
      setEditLoading(true);
      await axios
        .put(`http://api.selligo.in/category/updateCategory/${id}`, {
          category_type,
          attributes,
          sections,
        })
        .then((res) => {
          setEditLoading(false);
          toast.success(res.data.message);
          getCategoryData();
        });
    } catch (err) {
      setEditLoading(false);
      alert(err.response.data.error);
    }
  };
  return (
    <div className="edit-category-container">
      <Navigation />
      {Loading ? (
        <BigLoader />
      ) : (
        <div>
          <h1>Update Category</h1>
          <div className="category-form">
            <TextField
              id="outlined-search"
              label="Category name"
              type="text"
              size="small"
              value={category_type}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <h2>Step 1</h2>
            {attributes.map((attribute, attributeIndex) => (
              <div key={attribute.id} className="attribute">
                <TextField
                  type="text"
                  label="Attribute Heading"
                  size="small"
                  defaultValue={attribute.attributeHeading}
                  onChange={(e) =>
                    handleAttributeChange(
                      attributeIndex,
                      "attributeHeading",
                      e.target.value
                    )
                  }
                />
                {attribute.options.map((option, optionIndex) => (
                  <div key={option.id} className="option">
                    <TextField
                      type="text"
                      label="Option Heading"
                      defaultValue={option.optionHeading}
                      size="small"
                      sx={{ mt: 2 }}
                      onChange={(e) =>
                        handleAttributeChange(
                          attributeIndex,
                          `options.${optionIndex}.optionHeading`,
                          e.target.value,
                          optionIndex
                        )
                      }
                    />
                    <TextField
                      type="text"
                      label="Option Type"
                      defaultValue={option.optionType}
                      size="small"
                      sx={{ mt: 2, ml: 2 }}
                      onChange={(e) =>
                        handleAttributeChange(
                          attributeIndex,
                          `options.${optionIndex}.optionType`,
                          e.target.value,
                          optionIndex
                        )
                      }
                    />
                    <TextField
                      type="text"
                      label="Option Description"
                      defaultValue={option.optionDescription}
                      size="small"
                      sx={{ mt: 2, ml: 2 }}
                      onChange={(e) =>
                        handleAttributeChange(
                          attributeIndex,
                          `options.${optionIndex}.optionDescription`,
                          e.target.value,
                          optionIndex
                        )
                      }
                    />
                    <DeleteIcon
                      sx={{
                        mt: 2,

                        color: "#5644c4",
                        padding: 1,
                        "&:hover": {
                          backgroundColor: "#5644c4",
                          color: "white",
                        },
                      }}
                      onClick={() =>
                        removeAttributeOption(attributeIndex, optionIndex)
                      }
                    >
                      X
                    </DeleteIcon>
                  </div>
                ))}
                <br />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    mt: 2,
                    backgroundColor: "#5644c4",
                    color: "white",
                    padding: 0.5,
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#5644c4",
                    },
                  }}
                  size="small"
                  onClick={() => addAttributeOption(attributeIndex)}
                >
                  Add Option
                </Button>
                <br />
                <Button
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  sx={{
                    mt: 2,
                    backgroundColor: "#5644c4",
                    color: "white",
                    padding: 1,
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#5644c4",
                    },
                  }}
                  onClick={() => removeAttribute(attributeIndex)}
                  size="small"
                >
                  Delete
                </Button>
              </div>
            ))}
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                backgroundColor: "#5644c4",
                color: "white",
                padding: 1,
                "&:hover": {
                  backgroundColor: "white",
                  color: "#5644c4",
                },
              }}
              onClick={addAttribute}
            >
              Add Attribute
            </Button>
            <br />
            <br />
            <hr />
            <h2>Step 2</h2>
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="section">
                <TextField
                  id="outlined-search"
                  label="Page No"
                  type="number"
                  sx={{ mb: 2 }}
                  defaultValue={section.pageNo}
                  onChange={(e) =>
                    handleInputChange(sectionIndex, "pageNo", e.target.value)
                  }
                />
                <TextField
                  id="outlined-search"
                  label="Page Heading"
                  type="text"
                  defaultValue={section.pageHeading}
                  sx={{ ml: 2 }}
                  onChange={(e) =>
                    handleInputChange(
                      sectionIndex,
                      "pageHeading",
                      e.target.value
                    )
                  }
                />
                <TextField
                  id="outlined-search"
                  label="Page Description"
                  type="text"
                  defaultValue={section.pageDescription}
                  sx={{ ml: 2 }}
                  onChange={(e) =>
                    handleInputChange(
                      sectionIndex,
                      "pageDescription",
                      e.target.value
                    )
                  }
                />
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
                      onChange={(e) =>
                        handleInputChange(
                          sectionIndex,
                          `options.${optionIndex}.optionHeading`,
                          e.target.value,
                          optionIndex
                        )
                      }
                    />
                    <TextField
                      id="outlined-search"
                      label="Option Type"
                      type="search"
                      size="small"
                      defaultValue={option.optionType}
                      sx={{ ml: 2, mb: 2 }}
                      onChange={(e) =>
                        handleInputChange(
                          sectionIndex,
                          `options.${optionIndex}.optionType`,
                          e.target.value,
                          optionIndex
                        )
                      }
                    />
                    <TextField
                      id="outlined-search"
                      label="Option Description"
                      type="search"
                      size="small"
                      defaultValue={option.optionDescription}
                      sx={{ ml: 2, mb: 2 }}
                      onChange={(e) =>
                        handleInputChange(
                          sectionIndex,
                          `options.${optionIndex}.optionDescription`,
                          e.target.value,
                          optionIndex
                        )
                      }
                    />
                    <DeleteIcon
                      onClick={() => removeOption(sectionIndex, option.id)}
                      sx={{
                        color: "#5644c4",
                        padding: 1,
                        "&:hover": {
                          backgroundColor: "#5644c4",
                          color: "white",
                        },
                      }}
                    />
                  </div>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  size="small"
                  sx={{
                    mt: 2,
                    backgroundColor: "#5644c4",
                    color: "white",
                    padding: 0.5,
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#5644c4",
                    },
                  }}
                  onClick={() => addOption(sectionIndex)}
                >
                  Add Option
                </Button>
                <br />
                <br />
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  size="small"
                  sx={{
                    mt: 2,
                    backgroundColor: "#5644c4",
                    color: "white",
                    padding: 1,
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#5644c4",
                    },
                  }}
                  onClick={() => removeSection(section.id)}
                >
                  Delete Section
                </Button>
              </div>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addSection}
              sx={{
                mt: 2,
                backgroundColor: "#5644c4",
                color: "white",
                padding: 0.5,
                "&:hover": {
                  backgroundColor: "white",
                  color: "#5644c4",
                },
              }}
              size="small"
            >
              Add Section
            </Button>
            <br />
            <br />
            <Button
              variant="contained"
              onClick={submitData}
              sx={{
                backgroundColor: "#5644c4",
                color: "white",
                padding: 1,
                "&:hover": {
                  backgroundColor: "white",
                  color: "#5644c4",
                },
              }}
              disabled={editLoading}
            >
              {editLoading ? "Saving Changes..." : "Save"}
            </Button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EditCategory;
