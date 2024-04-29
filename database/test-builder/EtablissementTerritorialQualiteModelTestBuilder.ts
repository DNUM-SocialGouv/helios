import { ReclamationETModel } from "../models/ReclamationETModel";

export class ÉtablissementTerritorialQualitéModelTestBuilder {
    public static créeReclamations(champsSurchargés?: Partial<ReclamationETModel>): ReclamationETModel {
        const établissementTerritorialRéclamationsModel = new ReclamationETModel();
        établissementTerritorialRéclamationsModel.annee = champsSurchargés?.annee || 2023;
        établissementTerritorialRéclamationsModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '010000040';
        établissementTerritorialRéclamationsModel.clotMotif10 = champsSurchargés?.clotMotif10 || 1;
        établissementTerritorialRéclamationsModel.clotMotif11 = champsSurchargés?.clotMotif11 || 1;
        établissementTerritorialRéclamationsModel.clotMotif12 = champsSurchargés?.clotMotif12 || 1;
        établissementTerritorialRéclamationsModel.clotMotif13 = champsSurchargés?.clotMotif13 || 1;
        établissementTerritorialRéclamationsModel.clotMotif14 = champsSurchargés?.clotMotif14 || 1;
        établissementTerritorialRéclamationsModel.clotMotif15 = champsSurchargés?.clotMotif15 || 1;
        établissementTerritorialRéclamationsModel.clotMotif16 = champsSurchargés?.clotMotif16 || 1;
        établissementTerritorialRéclamationsModel.clotMotif17 = champsSurchargés?.clotMotif17 || 1;
        établissementTerritorialRéclamationsModel.clotMotif18 = champsSurchargés?.clotMotif18 || 1;
        établissementTerritorialRéclamationsModel.clotMotif19 = champsSurchargés?.clotMotif19 || 1;
        établissementTerritorialRéclamationsModel.clotMotif155 = champsSurchargés?.clotMotif155 || 1;
        établissementTerritorialRéclamationsModel.clotMotif156 = champsSurchargés?.clotMotif156 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif10 = champsSurchargés?.encoursMotif10 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif11 = champsSurchargés?.encoursMotif11 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif12 = champsSurchargés?.encoursMotif12 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif13 = champsSurchargés?.encoursMotif13 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif14 = champsSurchargés?.encoursMotif14 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif15 = champsSurchargés?.encoursMotif15 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif16 = champsSurchargés?.encoursMotif16 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif17 = champsSurchargés?.encoursMotif17 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif18 = champsSurchargés?.encoursMotif18 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif19 = champsSurchargés?.encoursMotif19 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif155 = champsSurchargés?.encoursMotif155 || 1;
        établissementTerritorialRéclamationsModel.encoursMotif156 = champsSurchargés?.encoursMotif156 || 1;
        établissementTerritorialRéclamationsModel.clotTotal = champsSurchargés?.clotTotal || 12;
        établissementTerritorialRéclamationsModel.encoursTotal = champsSurchargés?.encoursTotal || 12;
        return établissementTerritorialRéclamationsModel;
    }
}