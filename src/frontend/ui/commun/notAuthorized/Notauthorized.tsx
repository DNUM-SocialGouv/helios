import styles from "./Notauthorized.module.css";

export const NotAUthorized = () => {
    return (
        <div className={styles["not-authorized-message"]} > vous n&apos;êtes pas autorisé à consulter cette information. </div>
    );
};
