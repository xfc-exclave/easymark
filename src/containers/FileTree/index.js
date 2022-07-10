import { connect } from "react-redux";
import FileTree from "../../views/FileTree";
import { getDirectoryTree } from "../../redux/actions/directory";

export default connect((state) => ({ data: state }), { getDirectoryTree })(FileTree);