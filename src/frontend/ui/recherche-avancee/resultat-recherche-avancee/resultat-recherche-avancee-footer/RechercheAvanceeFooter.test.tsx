import { render, screen, fireEvent  } from '@testing-library/react';

import PaginationBtn from '../../../parametrage-utilisateurs/UsersListPage/Pagination/PaginationBtn/PaginationBtn';
import { TableFooterRechercheAvancee } from './RechercheAvanceeFooter';
import styles from './RechercheAvanceeFooter.module.css';

describe('PaginationBtn Component', () => {
    const setPage = jest.fn();

    const renderPaginationBtn = (page: number, lastPage: number) => {
        return render(
            <PaginationBtn paginationData={{ page, lastPage, setPage }}/>
        );
    };

    it('renders pagination buttons', () => {
        renderPaginationBtn(1, 10);
        expect(screen.getByRole('button', { name: /Page précédente/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Page suivante/i })).toBeInTheDocument();
    });

    it('disables "Page précédente" button on first page', () => {
        renderPaginationBtn(1, 10);
        expect(screen.getByRole('button', { name: /Page précédente/i })).toBeDisabled();
    });

    it('enables "Page suivante" button if not on last page', () => {
        renderPaginationBtn(1, 10);
        expect(screen.getByRole('button', { name: /Page suivante/i })).toBeEnabled();
    });

    it('calls setPage when "Page suivante" button is clicked', () => {
        renderPaginationBtn(1, 10);
        fireEvent.click(screen.getByRole('button', { name: /Page suivante/i }));
        expect(setPage).toHaveBeenCalledWith(2);
    });

    it('calls setPage when "Page précédente" button is clicked', () => {
        renderPaginationBtn(2, 10);
        fireEvent.click(screen.getByRole('button', { name: /Page précédente/i }));
        expect(setPage).toHaveBeenCalledWith(1);
    });

    it('disables "Page suivante" button on last page', () => {
        renderPaginationBtn(10, 10);
        expect(screen.getByRole('button', { name: /Page suivante/i })).toBeDisabled();
    });
});


describe('TableFooterRechercheAvancee lines number Component', () => {
    const setPage = jest.fn();

    it('renders the correct number of results', () => {
        render(<TableFooterRechercheAvancee lastPage={10} nombreRésultats={100} page={1} setPage={setPage} />);
        expect(screen.getByText(/100 lignes/i)).toBeInTheDocument();
    });

    it('applies the correct CSS classes', () => {
        render(<TableFooterRechercheAvancee lastPage={10} nombreRésultats={100} page={1} setPage={setPage} />);
        
        const footerContainer = screen.getByTestId('footer-container');
        expect(footerContainer).toHaveClass(styles["footer-container"]);

        const numberLinesContainer = screen.getByTestId('number-lines-container');
        expect(numberLinesContainer).toHaveClass(`fr-table__detail ${styles["number-lines-container"]}`);
    });
});