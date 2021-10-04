import React, { memo, useState, useEffect, useRef } from "react";
import pluginPkg from "../../../../package.json";
import { LoadingIndicator, PluginHeader } from "strapi-helper-plugin";
import AntSwitch from "../../components/AntSwitch";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FaTrashAlt } from "react-icons/fa";
import { MdExpandMore, MdExpandLess, MdAddCircleOutline } from "react-icons/md";

const HomePage = () => {
  const [menus, setMenus] = useState();
  const [menuId, setMenuId] = useState();
  const [menuName, setMenuName] = useState();
  const [pages, setPages] = useState();
  const [articles, setArticles] = useState();
  const [products, setProducts] = useState();
  const [courses, setCourses] = useState();
  const [categories, setCategories] = useState();
  const [siteContent, setSiteContent] = useState();
  const [menu, setMenu] = useState();
  const [subMenu, setSubMenu] = useState();
  const [contentLoaded, setContentLoaded] = useState(false);
  const [dropTitle, setDropTitle] = useState("");
  const [dropLink, setDroplink] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [pagesToggle, setPagesToggle] = useState(false);
  const [articlesToggle, setArticlesToggle] = useState(false);
  const [catergoriesToggle, setCatergoriesToggle] = useState(false);
  const [productsToggle, setProductsToggle] = useState(false);
  const [coursesToggle, setCoursesToggle] = useState(false);
  const [externalLinks, setExternalLinks] = useState();
  const [externalLinkToggle, setExternalLinkToggle] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [copyMobile, setCopyMobile] = useState(false);

  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;
  const name = pluginPkg.strapi.name;

  const myContainer = useRef(null);

  const getContent = async () => {
    const reqPages = await fetch(
      "http://localhost:1337/pages?status=published"
    );
    const resPages = await reqPages.json();
    const reqArticles = await fetch(
      "http://localhost:1337/articles?status=published"
    );
    const resArticles = await reqArticles.json();
    const reqProducts = await fetch("http://localhost:1337/products");
    const resProducts = await reqProducts.json();
    const reqCourses = await fetch(
      "http://localhost:1337/courses?status=published"
    );
    const resCourses = await reqCourses.json();
    const reqCategories = await fetch("http://localhost:1337/categories");
    const resCategories = await reqCategories.json();
    const reqExternalLinks = await fetch(
      "http://localhost:1337/external-links"
    );
    const resExternalLinks = await reqExternalLinks.json();
    const content = [
      ...resPages,
      ...resArticles,
      ...resProducts,
      ...resCourses,
      ...resCategories,
      ...resExternalLinks,
    ];
    //const reqCurrentMenu = await fetch("http://localhost:1337/")
    setPages(resPages);
    setArticles(resArticles);
    setProducts(resProducts);
    setCourses(resCourses);
    setCategories(resCategories);
    setSiteContent(content);
    setContentLoaded(true);
    setExternalLinks(resExternalLinks);
  };

  const getMenus = async () => {
    const req = await fetch("http://localhost:1337/navigations");
    const res = await req.json();
    localStorage.setItem("menus", JSON.stringify(res));
    setMenuId(res[0].id);
    setMenus(JSON.parse(localStorage.getItem("menus")));
    const getMenuArray = JSON.parse(localStorage.menus);
    let initalMenu = getMenuArray[0];

    if (initalMenu.data) {
      setMenuName(initalMenu.Menu);
      setMenu(initalMenu.data);
      sessionStorage.setItem("menu", JSON.stringify(initalMenu.data));
    } else {
      null;
    }
  };

  useEffect(() => {
    getMenus();
    getContent();
  }, []);

  const handleMenu = (e) => {
    setMenuId(e.target.value);
    let retriveStorage;
    const changeMenu = JSON.parse(localStorage.menus);
    let menuIndex = changeMenu.findIndex((x) => x.id == e.target.value);
    let filteredMenu = changeMenu.filter((menu) => menu.id === e.target.value);
    setMenuName(filteredMenu[0].Menu);
    const array = filteredMenu[0].data;
    const sessionStorageMenu = JSON.parse(sessionStorage.menu);
    if (!sessionStorageMenu) {
      sessionStorage.setItem("menu", JSON.stringify(array));
      retriveStorage = JSON.parse(sessionStorage.getItem("menu"));
      setMenu(retriveStorage);
    } else if (sessionStorage != filteredMenu.id) {
      sessionStorage.setItem("menu", JSON.stringify(array));
      retriveStorage = JSON.parse(sessionStorage.getItem("menu"));
      setMenu(retriveStorage);
      if (menus[0].Menu != filteredMenu[0].Menu) {
        setCopyMobile(false);
      }
    } else {
      return null;
    }
  };

  function copyMenu(data) {
    if (!menu) {
      sessionStorage.setItem("menu", JSON.stringify(data));
      const retriveStorage = JSON.parse(sessionStorage.getItem("menu"));
      setMenu(retriveStorage);
      if (disabled === true) {
        setDisabled(false);
      }
    } else {
      // Creating a copy of item before removing it from state, this is for sortable - retrive the orignal index

      sessionStorage.setItem("menu", JSON.stringify([...menu, ...data]));
      const retriveStorage = JSON.parse(sessionStorage.getItem("menu"));
      setMenu(retriveStorage);
      if (disabled === true) {
        setDisabled(false);
      }
    }
  }

  function copySubMenu(data) {
    console.log("The data in the copySubMenu function ln 152",data)
    if (!subMenu) {
      setSubMenu(data);
    } else {
      // Creating a copy of item before removing it from state, this is for sortable - retrive the orignal index
      //const itemCopy = subMenu

      setSubMenu([...subMenu, ...data]);
    }
  }
  /**
   * functions for drop and drag
   */

  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev, item, parent) {
    console.log("The Parent passed to drag", parent)
    let combine = {...item, parent}
    var itemText = JSON.stringify(combine);
    ev.dataTransfer.setData("text", itemText);
    console.log("The Drag Function", itemText)
  }

  function dragSubMenu(ev, parent) {
console.log("The subMenu in the drapSubMenu function ln 178", subMenu)
    let multiLevel = { shortName: dropTitle, subMenu: subMenu };

    var itemText = JSON.stringify(multiLevel);

    ev.dataTransfer.setData("text", itemText);
  }

  function drop(ev) {
    ev.preventDefault();
    var data = JSON.parse(ev.dataTransfer.getData("text"));
    console.log("The text passed to data in the drop function ln 188", data)
    console.log("The id of the item in drop function ln 189", data.id)
    console.log("The slug passed to drop function ln 190", data.url)
    let id;
    let url
    let external = data.external
    if (data.id) {
      id = data.id;
    } else {
      id = data.shortName;
    }
    if(data.parent){
     url = `/${data.parent}/${data.slug}`
    }
    else if(data.external){
      url = `${data.url}`
    }
    else{
     url = `/${data.slug}`
    }
    
    let shortName = data.shortName;
    let newTab = data.newTab;
    let subMenu = data.subMenu;
    let newData = { id, url, shortName, subMenu, newTab, external };
    copyMenu([newData]);
    console.log("The newData in the Drop function ln 206", newData)
    // Clear the drag data cache (for all formats/types)
    ev.dataTransfer.clearData();
    // Clear the drop down builder subMenu
    if (subMenu) {
      setSubMenu();
      setDropTitle("");
    }
  }

  function dropSubMenu(ev) {
    ev.preventDefault();
    let url;
    let id;
    let parentTitle = dropTitle;
    var data = JSON.parse(ev.dataTransfer.getData("text"));
    console.log("Data in the dropSubMenu function ln 231", data)
    let external = data.external
    if (data.id) {
      id = data.id;
    } else {
      id = parentTitle;
    }
    if(data.parent && data.slug){
      url = `/${data.parent}/${data.slug}`
    }
     else if (data.slug) {
      url = `/${data.slug}`;
    } 
    else if(data.external){
      url = data.url
    }
    
    else {
      url = "/"; // the home page
    }
    
    let shortName = data.shortName;
    let newTab = data.newTab;
    let newData = { id, url, parentTitle, shortName, newTab, external };
    copySubMenu([newData]);
console.log("The newData in the dropSubMenu function ln 256", newData)
    // Clear the drag data cache (for all formats/types)
    ev.dataTransfer.clearData();
  }

  function noDrop(ev) {
    ev.preventDefault();
    return null;
  }

  async function handleClick(ev) {
    setContentLoaded(false);

    await fetch(`http://localhost:1337/navigations/${menuId}`, {
      method: "PUT",
      body: JSON.stringify({ data: menu }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          strapi.notification.toggle({
            type: "success",
            message: "Your menu has been saved",
          });
        }
      })
      .then(async function () {
        const mobileID = menus[2].id;
        // get the mobile menu id and pass it to the put function - TODO
        if (copyMobile && menuId != mobileID) {
          await fetch(`http://localhost:1337/navigations/${mobileID}`, {
            method: "PUT",
            body: JSON.stringify({ data: menu }),
            headers: {
              "Content-type": "application/json",
            },
          });
        }
      })

      .then(async function () {
        const req = await fetch("http://localhost:1337/navigations");
        const res = await req.json();
        localStorage.setItem("menus", JSON.stringify(res));
      });
    setCopyMobile(false);
    setContentLoaded(true);
    setDisabled(true);
  }

  const deleteItem = (e, item) => {
    let menuIndex = menu.findIndex((x) => x.id == item.id);
    let menuArray = menu;
    menuArray.splice(menuIndex, 1);
    sessionStorage.setItem("menu", JSON.stringify(menuArray));
    let newMenu = JSON.parse(sessionStorage.getItem("menu"));
    setMenu(newMenu);
    if (disabled) {
      setDisabled(false);
    }
  };

  const deleteBuilderItem = (e, item) => {
    const filteredMenu = subMenu.filter((remove) => remove.id != item.id);
    setSubMenu(filteredMenu);
  };

  const addExternal = async () => {
    let url = dropLink;
    let newTab = true;
    let shortName = linkName;
    //let external = true
    await fetch("http://localhost:1337/external-links", {
      method: "POST",
      body: JSON.stringify({ url, newTab, shortName }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setExternalLinks([...externalLinks, data]))
      .then(
        strapi.notification.toggle({
          type: "success",
          message: "The New Link has been created",
        })
      );
  };

  const deleteSubItem = (e, item) => {
    let filteredMenu = menu.filter(
      (name) => name.shortName == item.parentTitle
    );
    let filteredParentIndex = menu.findIndex(
      (x) => x.shortName == item.parentTitle
    );
    let menuChildIndex = filteredMenu[0].subMenu.findIndex(
      (x) => x.id == item.id
    );
    let menuArray = menu;
    menuArray[filteredParentIndex].subMenu.splice(menuChildIndex, 1);
    sessionStorage.setItem("menu", JSON.stringify(menuArray));
    let newMenu = JSON.parse(sessionStorage.getItem("menu"));
    setMenu(newMenu);
    if (disabled) {
      setDisabled(false);
    }
  };

  const externalSwitch = (item) => {
    if (disabled) {
      setDisabled(false);
    }
    let menuIndex = menu.findIndex((x) => x.id == item.id);
    let newState = !item.newTab;
    let newArray = {
      id: item.id,
      newTab: newState,
      shortName: item.shortName,
      url: item.url,
    };
    let menuArray = menu;
    menuArray.splice(menuIndex, 1, newArray);
    sessionStorage.setItem("menu", JSON.stringify(menuArray));
    let newMenu = JSON.parse(sessionStorage.getItem("menu"));
    setMenu(newMenu);
  };

  const externalSubMenuSwitch = (item) => {
    if (disabled) {
      setDisabled(false);
    }
    let filteredMenu = menu.filter(
      (name) => name.shortName == item.parentTitle
    );
    let filteredParentIndex = menu.findIndex(
      (x) => x.shortName == item.parentTitle
    );
    let menuChildIndex = filteredMenu[0].subMenu.findIndex(
      (x) => x.id == item.id
    );
    let newState = !item.newTab;
    let newSubmenuArray = {
      id: item.id,
      newTab: newState,
      parentTitle: item.parentTitle,
      shortName: item.shortName,
      url: item.url,
    };
    let menuArray = menu;
    menuArray[filteredParentIndex].subMenu.splice(
      menuChildIndex,
      1,
      newSubmenuArray
    );
    sessionStorage.setItem("menu", JSON.stringify(menuArray));
    let newMenu = JSON.parse(sessionStorage.getItem("menu"));
    setMenu(newMenu);
  };

  return (
    <>
      <PluginHeader title={name} description={pluginDescription} />
      {/* Use Strapi Helper to set plugin title and description */}
      <hr />
      {!contentLoaded ? (
        <div style={{ paddingTop: "70px" }}>
          <LoadingIndicator />{" "}
        </div>
      ) : (
        siteContent && (
          <>
            <span style={{ display: "flex" }}>
              <h1>Drag &amp; Drop Menu Builder</h1>
              <button
                type="button"
                disabled={disabled}
                style={{
                  fontWeight: 600,
                  minWidth: "100px",
                  cursor: "pointer",
                  float: "right",
                  color: "white",
                  marginLeft: "auto",
                  marginRight: "50px",
                  backgroundColor: !disabled ? "#007eff" : "lightgrey",
                }}
                onClick={(e) => handleClick(e)}
              >
                Save
              </button>
            </span>
            <div
              style={{
                margin: "15px",
                backgroundColor: "#FFF",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "0.4px",
              }}
            >
              <div
                style={{
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  display: "flex",
                }}
              >
                <span style={{ display: "flex" }}>
                  <h4 style={{ margin: "auto", width: "50%" }}>Select Menu</h4>

                  <select
                    style={{
                      border: "1px solid rgb(170, 170, 170)",
                      padding: "4px",
                      borderRadius: "8px",
                      margin: "5px",
                      backgroundColor: "lightgrey",
                    }}
                    defaultValue={menus[0].id}
                    onChange={handleMenu}
                  >
                    {menus &&
                      menus.map((menu) => {
                        return (
                          <>
                            {menuId === menu.id ? (
                              <option key={menu.id} value={menu.id}>
                                {menu.Menu}
                              </option>
                            ) : (
                              <option key={menu.id} value={menu.id}>
                                {menu.Menu}
                              </option>
                            )}
                          </>
                        );
                      })}
                  </select>
                </span>
                {/* Add external url */}
                <div
                  style={{
                    display: "flex",
                    marginLeft: "auto",
                    marginRight: "10px",
                  }}
                >
                  <h4 style={{ margin: "auto", width: "50%" }}>
                    External Link
                  </h4>
                  <span style={{ display: "flex", marginLeft: "5px" }}>
                    <form
                      style={{ margin: "auto", width: "90%", display: "flex" }}
                    >
                      <input
                        autoComplete="off"
                        onDrop={(e) => noDrop(e)}
                        onDragOver={(e) => noDrop(e)}
                        id="name"
                        placeholder="Example"
                        value={linkName}
                        type="text"
                        style={{
                          border: "1px solid grey",
                          cursor: "arrow",
                          maxWidth: "40%",
                          marginRight: "5px",
                        }}
                        onChange={(e) => setLinkName(e.target.value)}
                      ></input>

                      <input
                        autoComplete="off"
                        onDrop={(e) => noDrop(e)}
                        onDragOver={(e) => noDrop(e)}
                        id="url"
                        placeholder="https://example.com"
                        value={dropLink}
                        type="text"
                        style={{
                          border: "1px solid grey",
                          cursor: "arrow",
                          maxWidth: "40%",
                        }}
                        onChange={(e) => setDroplink(e.target.value)}
                      ></input>

                      <MdAddCircleOutline
                        size={24}
                        style={{ marginLeft: "auto", marginRight: "5px" }}
                        onClick={() => addExternal()}
                      />
                    </form>
                  </span>
                </div>
              </div>
            </div>

            <hr />
            <div
              className="App"
              style={{
                backgroundColor: "white",
                margin: "20px",
                minHeight: "500px",
                border: "1px solid lightgrey",
              }}
            >
              <div style={{ display: "flex" }}>
                <div style={{ width: "50%", margin: "5px" }}>
                  <div style={{ width: "100%", display: "flex" }}>
                    <h3>{menuName} Items</h3>
                    {menuName === menus[0].Menu && (
                      <label
                        style={{
                          marginLeft: "auto",
                          marginRight: "10px",
                          display: "flex",
                        }}
                      >
                        Copy to Mobile Menu
                        <input
                          style={{
                            marginLeft: "5px",
                            marginRight: "5px",
                            marginTop: "auto",
                            marginBottom: "auto",
                          }}
                          type="checkbox"
                          checked={copyMobile}
                          onChange={(e) => setCopyMobile(!copyMobile)}
                        />
                      </label>
                    )}
                  </div>
                  <div style={{ paddingTop: "5px" }}>
                    <ul
                      id="menuList"
                      style={{
                        listStyleType: "none",
                        margin: "0",
                        padding: "0",
                      }}
                    >
                      <div
                        id="div1"
                        style={{
                          width: "100%",
                          minHeight: "70px",
                          padding: "10px",
                          border: "1px solid #aaaaaa",
                          borderRadius: "8px",
                        }}
                        onDrop={(e) => drop(e)}
                        onDragOver={(e) => allowDrop(e)}
                      >
                        {menu &&
                          menu.map((menuItem, index) => {
                            return (
                              <div
                                id={menuItem.shortName}
                                key={menuItem.shortName}
                              >
                                <span style={{ display: "flex" }}>
                                  <li
                                    key={
                                      menuItem.id
                                        ? menuItem.id
                                        : menuItem.shortName
                                    }
                                    id={
                                      menuItem.id
                                        ? menuItem.id
                                        : menuItem.shortName
                                    }
                                    key={index}
                                    index={index}
                                  >
                                    {menuItem.shortName}
                                  </li>
                                  <span
                                    style={{
                                      display: "flex",
                                      marginLeft: "auto",
                                      marginRight: "5px",
                                    }}
                                  >
                                    {!menuItem.subMenu && (
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        {/*<Typography>internal</Typography>*/}
                                        <AntSwitch
                                          checked={menuItem.newTab}
                                          inputProps={{
                                            "aria-label": "ant design",
                                          }}
                                          onChange={(e) =>
                                            externalSwitch(menuItem)
                                          }
                                        />
                                        <Typography>New Tab</Typography>
                                      </Stack>
                                    )}
                                    <button
                                      style={{ marginLeft: "5px" }}
                                      onClick={(e) => deleteItem(e, menuItem)}
                                    >
                                      <FaTrashAlt />
                                    </button>
                                  </span>
                                </span>
                                {menuItem.subMenu && (
                                  <ul
                                    style={{
                                      listStyleType: "none",
                                      margin: "0",
                                      padding: "0",
                                    }}
                                  >
                                    {menuItem.subMenu.map((item, index) => {
                                      return (
                                        <span style={{ display: "flex" }}>
                                          <li
                                            style={{ paddingLeft: "15px" }}
                                            id={item.id}
                                            key={index}
                                          >
                                            {item.shortName}
                                          </li>
                                          <span
                                            style={{
                                              display: "flex",
                                              marginLeft: "auto",
                                              marginRight: "5px",
                                            }}
                                          >
                                            <Stack
                                              direction="row"
                                              spacing={1}
                                              alignItems="center"
                                            >
                                              {/*<Typography>internal</Typography>*/}
                                              <AntSwitch
                                                checked={item.newTab}
                                                inputProps={{
                                                  "aria-label": "ant design",
                                                }}
                                                onChange={() =>
                                                  externalSubMenuSwitch(item)
                                                }
                                              />
                                              <Typography>New Tab</Typography>
                                            </Stack>
                                            <button
                                              style={{ marginLeft: "5px" }}
                                              onClick={(e) =>
                                                deleteSubItem(e, item)
                                              }
                                            >
                                              <FaTrashAlt />
                                            </button>
                                          </span>
                                        </span>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </ul>
                  </div>
                </div>
                <div style={{ width: "25%", margin: "5px" }}>
                  <h3>Content Select</h3>
                  <div className="pages">
                    <ul
                      style={{
                        listStyleType: "none",
                        margin: "0",
                        padding: "0",
                      }}
                    >
                      <span style={{ display: "flex", paddingTop: "5px" }}>
                        <h3>Pages</h3>
                        {pagesToggle ? (
                          <MdExpandLess
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setPagesToggle(false)}
                          />
                        ) : (
                          <MdExpandMore
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setPagesToggle(true)}
                          />
                        )}
                      </span>
                      <hr />

                      {pagesToggle &&
                        pages &&
                        pages.map((page, index) => {
                          return (
                            <li
                              id={page.id}
                              draggable
                              style={{ cursor: "grab" }}
                              onDragStart={(e) => drag(e, page)}
                              key={page.id}
                              index={index}
                            >
                              {page.shortName}
                            </li>
                          );
                        })}
                      <span style={{ display: "flex", paddingTop: "5px" }}>
                        <h3>Articles</h3>
                        {articlesToggle ? (
                          <MdExpandLess
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setArticlesToggle(false)}
                          />
                        ) : (
                          <MdExpandMore
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setArticlesToggle(true)}
                          />
                        )}
                      </span>
                      <hr />
                      {articlesToggle &&
                        articles &&
                        articles.map((article, index) => {
                          let parentCategory ="article"
                          return (
                            <li
                              id={article.id}
                              draggable
                              style={{ cursor: "grab" }}
                              onDragStart={(e) => drag(e, article,parentCategory)}
                              key={article.id}
                              index={index}
                            >
                              {article.shortName}
                            </li>
                          );
                        })}
                      <span style={{ display: "flex", paddingTop: "5px" }}>
                        <h3>Catergories</h3>
                        {catergoriesToggle ? (
                          <MdExpandLess
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setCatergoriesToggle(false)}
                          />
                        ) : (
                          <MdExpandMore
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setCatergoriesToggle(true)}
                          />
                        )}
                      </span>
                      <hr />
                      {catergoriesToggle &&
                        categories &&
                        categories.map((catergory, index) => {
                          let parentCategory ="category"
                          return (
                            <li
                              id={catergory.id}
                              draggable
                              style={{ cursor: "grab" }}
                              onDragStart={(e) => drag(e, catergory, parentCategory)}
                              key={catergory.id}
                              index={index}
                            >
                              {catergory.shortName}
                            </li>
                          );
                        })}
                      <span style={{ display: "flex", paddingTop: "5px" }}>
                        <h3>Products</h3>
                        {productsToggle ? (
                          <MdExpandLess
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setProductsToggle(false)}
                          />
                        ) : (
                          <MdExpandMore
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setProductsToggle(true)}
                          />
                        )}
                      </span>
                      <hr />
                      {productsToggle &&
                        products &&
                        products.map((product, index) => {
                          let parentCategory ="products"
                          return (
                            <li
                              id={product.id}
                              draggable
                              style={{ cursor: "grab" }}
                              onDragStart={(e) => drag(e, product, parentCategory)}
                              key={product.id}
                              index={index}
                            >
                              {product.shortName}
                            </li>
                          );
                        })}
                      <span style={{ display: "flex", paddingTop: "5px" }}>
                        <h3>Courses</h3>
                        {coursesToggle ? (
                          <MdExpandLess
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setCoursesToggle(false)}
                          />
                        ) : (
                          <MdExpandMore
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setCoursesToggle(true)}
                          />
                        )}
                      </span>
                      <hr />
                      {coursesToggle &&
                        courses &&
                        courses.map((course, index) => {
                          let parentCategory ="courses"
                          return (
                            <li
                              id={course.id}
                              draggable
                              style={{ cursor: "grab" }}
                              onDragStart={(e) => drag(e, course, parentCategory)}
                              key={course.id}
                              index={index}
                            >
                              {course.shortName}
                            </li>
                          );
                        })}

                      <span style={{ display: "flex", paddingTop: "5px" }}>
                        <h3>External Links</h3>
                        {externalLinkToggle ? (
                          <MdExpandLess
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setExternalLinkToggle(false)}
                          />
                        ) : (
                          <MdExpandMore
                            size={24}
                            style={{ marginLeft: "auto", marginRight: "5px" }}
                            onClick={() => setExternalLinkToggle(true)}
                          />
                        )}
                      </span>
                      <hr />
                      {externalLinkToggle &&
                        externalLinks &&
                        externalLinks.map((link, index) => {
                          return (
                            <li
                              id={link.id}
                              draggable
                              style={{ cursor: "grab" }}
                              onDragStart={(e) => drag(e, link)}
                              key={link.id}
                              index={index}
                            >
                              {link.shortName}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
                {/* Drop Down Menu Items*/}
                <div style={{ width: "25%", margin: "5px" }}>
                  <h3>Drop Down Builder</h3>
                  <div className="builder">
                    <form
                      id="menuBuilder"
                      style={{ backgroundColor: "transparent" }}
                    >
                      <label htmlFor="topMenu">Menu Title:</label>
                      <input
                        autoComplete="off"
                        onDrop={(e) => noDrop(e)}
                        onDragOver={(e) => noDrop(e)}
                        draggable="false"
                        id="topMenu"
                        placeholder="Create a top level menu item"
                        value={dropTitle}
                        type="text"
                        style={{ border: "1px solid grey", maxWidth: "100%" }}
                        onChange={(e) => setDropTitle(e.target.value)}
                      ></input>
                    </form>
                  </div>
                  {dropTitle && (
                    <div
                      draggable
                      onDragStart={(e) => dragSubMenu(e)}
                      id="subMenu"
                      onDrop={(e) => dropSubMenu(e)}
                      onDragOver={(e) => allowDrop(e)}
                      style={{
                        backgroundColor: "lightgrey",
                        minHeight: "36px",
                        cursor: "drag",
                      }}
                    >
                      <ul
                        style={{
                          listStyleType: "none",
                          margin: "0",
                          padding: "0",
                        }}
                      >
                        <div>
                          <li
                            key={dropTitle}
                            style={{
                              fontWeight: "bold",
                              minHeight: "22px",
                              cursor: "grab",
                            }}
                          >
                            {dropTitle}
                          </li>
                          <ul
                            style={{
                              listStyleType: "none",
                              margin: "0",
                              padding: "0px",
                            }}
                          >
                            <div
                              id="subMenu"
                              style={{
                                minHeight: "200px",
                                backgroundColor: "#fafafb",
                                border: "1px solid lightgrey",
                                cursor: "grab",
                              }}
                              onDrop={(e) => dropSubMenu(e)}
                              onDragOver={(e) => allowDrop(e)}
                            >
                              {subMenu &&
                                subMenu.map((menu, index) => {
                                  return (
                                    <span style={{ display: "flex" }}>
                                      <li
                                        id={menu.id}
                                        draggable
                                        key={index}
                                        style={{
                                          paddingLeft: "15px",
                                          cursor: "grab",
                                        }}
                                      >
                                        {menu.shortName}
                                      </li>
                                      <button
                                        style={{
                                          marginLeft: "auto",
                                          marginRight: "5px",
                                        }}
                                        onClick={(e) =>
                                          deleteBuilderItem(e, menu)
                                        }
                                      >
                                        <FaTrashAlt />
                                      </button>
                                    </span>
                                  );
                                })}
                            </div>
                          </ul>
                        </div>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )
      )}{" "}
    </>
  );
};

export default memo(HomePage);
