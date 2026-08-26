-- Migration: Add status column to room_transactions for deposit validation (approval system)

ALTER TABLE room_transactions 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'approved';

-- Recalculate room current_amount using trigger function that only sums approved transactions
CREATE OR REPLACE FUNCTION update_room_current_amount()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE rooms
  SET current_amount = COALESCE((
    SELECT SUM(
      CASE 
        WHEN is_income = TRUE THEN amount 
        ELSE -amount 
      END
    )
    FROM room_transactions
    WHERE room_id = COALESCE(NEW.room_id, OLD.room_id)
      AND status = 'approved'
  ), 0)
  WHERE id = COALESCE(NEW.room_id, OLD.room_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger for room_transactions
DROP TRIGGER IF EXISTS trigger_update_room_current_amount ON room_transactions;

CREATE TRIGGER trigger_update_room_current_amount
AFTER INSERT OR UPDATE OR DELETE ON room_transactions
FOR EACH ROW
EXECUTE FUNCTION update_room_current_amount();
