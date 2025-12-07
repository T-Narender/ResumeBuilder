// import React from "react";
// import { modalStyles as styles } from "../assets/dummystyle";
// import { X } from "lucide-react";

// const Modal = ({
//   children,
//   isOpen,
//   onClose,
//   title,
//   hideHeader,
//   showActionBtn,
//   actionBtnIcon = null,
//   actionBtnText,
//   onActionClick = () => {},
// }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div
//           className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
//           onClick={onClose}
//         ></div>

//         {/* Modal panel */}
//         <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
//             <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
//             <div className="flex items-center gap-3">
//               {/* Action Button in Header */}
//               {showActionBtn && (
//                 <button
//                   onClick={onActionClick}
//                   disabled={actionBtnDisabled}
//                   className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {actionBtnIcon}
//                   {actionBtnText}
//                 </button>
//               )}
//               {/* Close Button */}
//               <button
//                 onClick={onClose}
//                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="modal-content">{children}</div>

//           {/* Footer with Action Button (Alternative placement) */}
//           {showActionBtn && (
//             <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={onActionClick}
//                 disabled={actionBtnDisabled}
//                 className="inline-flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {actionBtnIcon}
//                 {actionBtnText}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import React from "react";
import { modalStyles } from "../assets/dummystyle";
import { X } from "lucide-react";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText = "Action",
  onActionClick = () => {},
  actionBtnDisabled = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.container}>
        {!hideHeader && (
          <div className={modalStyles.header}>
            <h2 className={modalStyles.title}>{title}</h2>

            {/* Action Button */}
            {showActionBtn && (
              <button
                onClick={onActionClick}
                disabled={actionBtnDisabled}
                className={`${modalStyles.actionButton} ${
                  actionBtnDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}

            {/* Close Button */}
            <button onClick={onClose} className={modalStyles.closeButton}>
              <X size={20} />
            </button>
          </div>
        )}

        {/* When header is hidden, still show a close cross in the top-right */}
        {hideHeader && (
          <button
            onClick={onClose}
            aria-label="Close"
            className={modalStyles.closeButton}
          >
            <X size={20} />
          </button>
        )}

        {/* Modal Body */}
        <div className={modalStyles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
