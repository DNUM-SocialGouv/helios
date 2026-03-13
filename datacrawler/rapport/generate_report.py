from typing import List, Dict, Any

def generate_report(results: List[Dict[str, Any]]) -> str:
    text_lines = []
    html_rows = []

    text_lines.append("Rapport ingestion Vigie RH\n")

    for r in results:
        table = r.get("table", "unknown")
        rows_in_file = r.get("rows_in_file", "-")
        rows = r.get("rows", "-")
        taux = r.get("taux", "-")
        duration = r.get("duration", "-")
        commentaires = r.get("commentaires", "")

        text_lines.append(
            f"{table} | {rows_in_file} | rows={rows} | taux={taux} | duration={duration}s | {commentaires}"
        )

        html_rows.append(f"""
        <tr>
            <td>{table}</td>
            <td>{rows_in_file}</td>
            <td>{rows}</td>
            <td>{taux}</td>
            <td>{duration}s</td>
            <td>{commentaires}</td>
        </tr>
        """)
    report_html = f"""
    <h2>Rapport ingestion Vigie RH</h2>
    <table border="1" cellpadding="6" cellspacing="0">
        <thead>
            <tr>
                <th>Table</th>
                <th>Lignes présentes dans le fichier</th>
                <th>Lignes ingérées</th>
                <th>Taux d'ingestion</th>
                <th>Durée</th>
                <th>Commentaires</th>
            </tr>
        </thead>
        <tbody>
            {''.join(html_rows)}
        </tbody>
    </table>
    """

    return report_html
