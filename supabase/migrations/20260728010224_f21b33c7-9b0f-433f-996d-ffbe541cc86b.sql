DROP POLICY IF EXISTS "vacantes_select_todas_autenticados" ON public.vacantes;

CREATE POLICY "vacantes_select_publicadas_autenticados"
ON public.vacantes
FOR SELECT
TO authenticated
USING (estado = 'publicada' OR auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));