import { connect } from "react-redux";
import MainLayout from "../../views/MainLayout";
import { addEditor, saveEditors } from "../../redux/actions/editor";

export default connect((state) => ({ data: state }), { addEditor, saveEditors })(MainLayout);