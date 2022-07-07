import { connect } from "react-redux";
import MarkEditor from "../../views/MarkEditor";
import { addEditor, saveEditors } from "../../redux/actions/editor";

export default connect((state) => ({ data: state }), { addEditor, saveEditors })(MarkEditor);