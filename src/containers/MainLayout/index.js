import { connect } from "react-redux";
import MainLayout from "../../views/MainLayout";
import { addEditor, saveEditors } from "../../redux/actions/editor";
import { getDirectoryTree } from "../../redux/actions/directory";
import { setActiveKey } from "../../redux/actions/active";

export default connect((state) => ({ data: state }), { addEditor, saveEditors, getDirectoryTree, setActiveKey })(MainLayout);